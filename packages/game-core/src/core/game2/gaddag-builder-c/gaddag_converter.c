#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <stdlib.h>

#define MAX_ALPHABET 43 // Max size: Slovak alphabet = 42. 43 with separator
#define MAX_WORD_LEN 15
#define MAX_WORD_WITH_SEPARATOR_LEN (MAX_WORD_LEN + 1)
#define SEPARATOR_ID 0

// Branch prediction hints
#define likely(x)   __builtin_expect(!!(x), 1)
#define unlikely(x) __builtin_expect(!!(x), 0)

typedef void (*ProgressCallback)(int);
ProgressCallback js_progress_cb = NULL;
int last_reported_percent = -5;

void report_progress(int percent) {
    if (percent >= last_reported_percent + 5) {
        last_reported_percent = percent;
        if (js_progress_cb) js_progress_cb(percent);
    }
}

void set_progress_callback(int cb_ptr) {
    js_progress_cb = (ProgressCallback)cb_ptr;
}

typedef struct {
    uint32_t first_child;
    uint32_t next_sibling;
    uint32_t packed;
} GaddagNode;

GaddagNode* node_arena = NULL;
size_t node_count = 0;
size_t node_capacity = 0;

// Lookup table unique à la place de 4 tableaux multidimensionnels
// Niveau 0: [0, MAX_ALPHABET)
// Niveau 1: [MAX_ALPHABET, MAX_ALPHABET + MAX_ALPHABET^2)
// Niveau 2: [MAX_ALPHABET + MAX_ALPHABET^2, MAX_ALPHABET + MAX_ALPHABET^2 + MAX_ALPHABET^3)
// Niveau 3: [MAX_ALPHABET + MAX_ALPHABET^2 + MAX_ALPHABET^3, ...]
#define LEVEL_0_BASE 0
#define LEVEL_1_BASE MAX_ALPHABET
#define LEVEL_2_BASE (MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET)
#define LEVEL_3_BASE (MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET)
#define LOOKUP_TABLE_SIZE (MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET + MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET)

uint32_t* lookup_table = NULL;
uint32_t* output_buffer = NULL;
size_t output_size = 0;
size_t output_capacity = 0;

typedef struct {
    uint32_t node_index;
    uint32_t next;
} HashEntry;

uint32_t* hash_buckets = NULL;
HashEntry* hash_entries = NULL;
size_t hash_size = 0;
size_t hash_entry_count = 0;
size_t hash_entry_capacity = 0;

GaddagNode node_templates[MAX_ALPHABET];

// Cache pour accélérer l'insertion via les rotations précédentes
uint32_t last_split_path[MAX_WORD_LEN + 1][MAX_WORD_LEN + 1];
uint8_t last_split_chars[MAX_WORD_LEN + 1][MAX_WORD_LEN + 1];
int last_split_len[MAX_WORD_LEN + 1];
uint32_t separator_nodes[MAX_ALPHABET];

// Progress Globals
uint32_t progress_max_index = 0;
size_t minified_count = 0;

// Fast next power of 2 using __builtin_clzll
static inline size_t next_power_of_2(size_t x) {
    if (x <= 1) return 1;
    if ((x & (x - 1)) == 0) return x;  // Already power of 2
    return 1ULL << (64 - __builtin_clzll(x - 1));
}

static inline uint32_t get_minified_id(uint32_t packed) {
    return packed & 0x1FFFFFF;  // bits 0-24
}

static inline uint8_t get_char_id(uint32_t packed) {
    return (packed >> 25) & 0x3F;  // bits 25-30
}

static inline uint8_t get_end_of_word(uint32_t packed) {
    return (packed >> 31) & 1;  // bit 31
}

static inline void set_end_of_word(uint32_t* packed) {
    *packed |= (1U << 31);
}

static inline void set_minified_id(uint32_t* packed, uint32_t minified_id) {
    *packed = (*packed & 0xFE000000) | (minified_id & 0x1FFFFFF);
}

// Masque pour comparer minified_id (bits 0-24) et char_id (bits 25-30) en un seul coup
#define PACKED_CHAR_AND_MINIFIED_MASK 0x7FFFFFFF  // Bits 0-30, ignore bit 31 (end_of_word)

uint8_t alphabet_len = 0;

// Branchless helpers
static inline void prefetch_if(uint32_t idx) {
    // Préfetch seulement si idx != 0, sans branche
    if (unlikely(idx != 0)) __builtin_prefetch(&node_arena[idx], 0, 1);
}

static inline uint32_t select_branchless(int condition, uint32_t a, uint32_t b) {
    // Retourne a si condition vrai, b sinon, sans branche
    return b ^ ((-condition) & (a ^ b));
}

static inline void maybe_set_eow(uint32_t* packed, int should_set) {
    // Set end_of_word sans branche
    *packed |= ((-should_set) & (1U << 31));
}

// Prefetch helper macro for sibling traversal
#define PREFETCH_SIBLING(idx) do { \
    if ((idx) != 0) __builtin_prefetch(&node_arena[(idx)], 0, 1); \
} while (0)

void init_node_templates() {
    for (int i = 0; i < MAX_ALPHABET; i++) {
        node_templates[i].first_child = 0;
        node_templates[i].next_sibling = 0;
        node_templates[i].packed = (i << 25);  // char_id en bits 25-30, minified_id=0 en bits 0-24, end_of_word=0 en bit 31
    }
}

void reset_memory() {
    if (node_arena) free(node_arena);
    if (output_buffer) free(output_buffer);
    if (hash_buckets) free(hash_buckets);
    if (hash_entries) free(hash_entries);
    if (lookup_table) free(lookup_table);
    node_arena = NULL; output_buffer = NULL; hash_buckets = NULL; hash_entries = NULL;
    lookup_table = NULL;
    node_count = 0; node_capacity = 0; output_size = 0; output_capacity = 0;
    hash_size = 0; hash_entry_count = 0; hash_entry_capacity = 0;
}


// Accesseurs pour la table de lookup aplatie
static inline uint32_t* lookup_level0(uint8_t target) {
    return &lookup_table[LEVEL_0_BASE + target];
}

static inline uint32_t* lookup_level1(uint8_t p0, uint8_t target) {
    return &lookup_table[LEVEL_1_BASE + (size_t)p0 * MAX_ALPHABET + target];
}

static inline uint32_t* lookup_level2(uint8_t p0, uint8_t p1, uint8_t target) {
    return &lookup_table[LEVEL_2_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET + target];
}

static inline uint32_t* lookup_level3(uint8_t p0, uint8_t p1, uint8_t p2, uint8_t target) {
    return &lookup_table[LEVEL_3_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p2 * MAX_ALPHABET + target];
}


void insert_rotated_path(const uint8_t* word, int total_len, int split) {
    uint8_t rotation[MAX_WORD_WITH_SEPARATOR_LEN];
    
    // Reverse copy du début : word[split-1] down to word[0]
    for (int i = 0; i < split; i++) {
        rotation[i] = word[split - 1 - i];
    }
    
    // Separator au milieu
    rotation[split] = SEPARATOR_ID;
    
    // Forward copy du reste avec memcpy si possible
    int tail_len = total_len - split - 1;
    if (tail_len > 0) {
        memcpy(&rotation[split + 1], &word[split], tail_len);
    }

    int common = 0;
    while (common < last_split_len[split] && common < total_len && rotation[common] == last_split_chars[split][common]) {
        common++;
    }

    uint32_t current = (common > 0) ? last_split_path[split][common - 1] : 0;
    uint8_t p0 = (common > 0) ? last_split_chars[split][0] : 0;
    uint8_t p1 = (common > 1) ? last_split_chars[split][1] : 0;
    uint8_t p2 = (common > 2) ? last_split_chars[split][2] : 0;

    uint32_t* l1_base = (common > 0) ? lookup_table + LEVEL_1_BASE + (size_t)p0 * MAX_ALPHABET : NULL;
    uint32_t* l2_base = (common > 1) ? lookup_table + LEVEL_2_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET : NULL;
    uint32_t* l3_base = (common > 2) ? lookup_table + LEVEL_3_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p2 * MAX_ALPHABET : NULL;

    for (int i = common; i < total_len; i++) {
        uint8_t target = rotation[i];
        uint32_t found = 0;

        if (i == 0) {
            found = lookup_table[LEVEL_0_BASE + target];
            if (unlikely(!found)) {
                found = node_count;
                node_arena[node_count++] = node_templates[target];
                lookup_table[LEVEL_0_BASE + target] = found;
                node_arena[found].next_sibling = node_arena[0].first_child;
                node_arena[0].first_child = found;
            }
            p0 = target;
            l1_base = lookup_table + LEVEL_1_BASE + (size_t)p0 * MAX_ALPHABET;
        } else if (i == 1) {
            found = l1_base[target];
            if (unlikely(!found)) {
                found = node_count;
                node_arena[node_count++] = node_templates[target];
                l1_base[target] = found;
                node_arena[found].next_sibling = node_arena[current].first_child;
                node_arena[current].first_child = found;
            }
            p1 = target;
            l2_base = lookup_table + LEVEL_2_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET;
        } else if (i == 2) {
            found = l2_base[target];
            if (unlikely(!found)) {
                found = node_count;
                node_arena[node_count++] = node_templates[target];
                l2_base[target] = found;
                node_arena[found].next_sibling = node_arena[current].first_child;
                node_arena[current].first_child = found;
            }
            p2 = target;
            l3_base = lookup_table + LEVEL_3_BASE + (size_t)p0 * MAX_ALPHABET * MAX_ALPHABET * MAX_ALPHABET + (size_t)p1 * MAX_ALPHABET * MAX_ALPHABET + (size_t)p2 * MAX_ALPHABET;
        } else if (i == 3) {
            found = l3_base[target];
            if (unlikely(!found)) {
                found = node_count;
                node_arena[node_count++] = node_templates[target];
                l3_base[target] = found;
                node_arena[found].next_sibling = node_arena[current].first_child;
                node_arena[current].first_child = found;
            }
        } else {
            uint32_t child = node_arena[current].first_child;
            uint32_t prev = 0;
            while (child != 0) {
                if (get_char_id(node_arena[child].packed) == target) { 
                    found = child; 
                    if (prev != 0) {
                        node_arena[prev].next_sibling = node_arena[child].next_sibling;
                        node_arena[child].next_sibling = node_arena[current].first_child;
                        node_arena[current].first_child = child;
                    }
                    break; 
                }
                prev = child;
                child = node_arena[child].next_sibling;
            }
            if (!found) {
                found = node_count;
                node_arena[node_count++] = node_templates[target];
                node_arena[found].next_sibling = node_arena[current].first_child;
                node_arena[current].first_child = found;
            }
        }
        current = found;
        last_split_path[split][i] = current;
        last_split_chars[split][i] = target;
        // Branchless assignments
        p0 = select_branchless(i == 0, target, p0);
        p1 = select_branchless(i == 1, target, p1);
        p2 = select_branchless(i == 2, target, p2);
    }
    last_split_len[split] = total_len;
    maybe_set_eow(&node_arena[current].packed, 1);  // Branchless set
}

void init_separator_nodes() {
    for (int i = 0; i < MAX_ALPHABET; i++) separator_nodes[i] = 0;
    for (int i = 1; i <= (int)alphabet_len; i++) {
        uint32_t root = *lookup_level0(i);
        if (likely(root)) {
            uint32_t sep = node_count;
            node_arena[node_count++] = node_templates[SEPARATOR_ID];
            *lookup_level1(i, SEPARATOR_ID) = sep;
            node_arena[sep].next_sibling = node_arena[root].first_child;
            node_arena[root].first_child = sep;
            separator_nodes[i] = sep;
        }
    }
}

void traverse_source(uint32_t* data, uint32_t index, uint32_t max_len, uint8_t* word, int depth) {
    while (true) {
        // if (index > progress_max_index) {
        //     progress_max_index = index;
        //     if (max_len > 0) report_progress((int)((uint64_t)index * 50 / max_len));
        // }

        uint32_t val = data[index];
        uint32_t child_ptr = val & 0xFFFFFF;

        word[depth] = (val >> 26) & 0x3F; // c_idx
        
        if ((val >> 25) & 1) {
            int word_len = depth + 2;
            for (int split = 1; split < word_len; split++) {
                insert_rotated_path(word, word_len, split);
            }
        }

        if (child_ptr != 0) {
            traverse_source(data, child_ptr, max_len, word, depth + 1);
        }
        
        if (!((val >> 24) & 1)) break;
        index++;
    }
}

void init_hash_map(size_t nodes) {
    hash_size = (next_power_of_2(nodes * 2) - 1) | 1;  // Assure impair
    hash_buckets = calloc(hash_size, sizeof(uint32_t));
    hash_entry_capacity = nodes;
    hash_entries = malloc(hash_entry_capacity * sizeof(HashEntry));
    hash_entry_count = 1;
}

uint32_t hash_node(uint32_t idx) {
    static const uint32_t h_init[2] = {
        (2166136261u ^ 0u) * 16777619u,
        (2166136261u ^ 1u) * 16777619u
    };
    GaddagNode* node = &node_arena[idx];
    uint32_t h = h_init[get_end_of_word(node->packed)];
    uint32_t c = node->first_child;
    while (c != 0) {
        GaddagNode* child = &node_arena[c];
        uint32_t next = child->next_sibling;
        if (likely(next != 0)) PREFETCH_SIBLING(node_arena[next].next_sibling);
        h ^= (child->packed & PACKED_CHAR_AND_MINIFIED_MASK);
        h *= 16777619;
        c = next;
    }
    return h;
}

bool are_equal(uint32_t a, uint32_t b) {
    GaddagNode* node_a = &node_arena[a];
    GaddagNode* node_b = &node_arena[b];
    // Branchless comparison for end_of_word
    uint32_t eow_match = (get_end_of_word(node_a->packed) == get_end_of_word(node_b->packed));
    if (unlikely(!eow_match)) return false;
    
    uint32_t ca = node_a->first_child;
    uint32_t cb = node_b->first_child;
    while (true) {
        if (unlikely(ca == 0 || cb == 0)) return ca == cb;
        uint32_t pa = node_arena[ca].packed;
        uint32_t pb = node_arena[cb].packed;
        if (unlikely((pa & PACKED_CHAR_AND_MINIFIED_MASK) != (pb & PACKED_CHAR_AND_MINIFIED_MASK))) return false;
        ca = node_arena[ca].next_sibling;
        cb = node_arena[cb].next_sibling;
    }
}

uint32_t minify(uint32_t idx) {
    GaddagNode* node = &node_arena[idx];
    uint32_t c = node->first_child;
    if (likely(c != 0)) PREFETCH_SIBLING(node_arena[c].next_sibling);
    while (likely(c != 0)) {
        GaddagNode* child = &node_arena[c];
        uint32_t next = child->next_sibling;
        if (likely(next != 0)) PREFETCH_SIBLING(node_arena[next].next_sibling);
        set_minified_id(&child->packed, minify(c));
        c = next;
    }

    // minified_count++;
    // if (node_count > 0) {
    //     // use uint64 to prevent overflow before division
    //     report_progress(50 + (int)((uint64_t)minified_count * 50 / node_count));
    // }

    uint32_t h = hash_node(idx);
    uint32_t bucket = h % hash_size;
    uint32_t entry = hash_buckets[bucket];
    while (likely(entry != 0)) {
        if (likely(are_equal(idx, hash_entries[entry].node_index))) {
            return get_minified_id(node_arena[hash_entries[entry].node_index].packed);
        }
        entry = hash_entries[entry].next;
    }
    uint32_t nid = hash_entry_count++;
    if (unlikely(nid >= hash_entry_capacity)) {
        hash_entry_capacity *= 2;
        hash_entries = realloc(hash_entries, hash_entry_capacity * sizeof(HashEntry));
    }
    hash_entries[nid].node_index = idx;
    hash_entries[nid].next = hash_buckets[bucket];
    hash_buckets[bucket] = nid;
    set_minified_id(&node->packed, nid);
    return nid;
}

void ensure_out(size_t n) {
    if (unlikely(output_size + n >= output_capacity)) {
        size_t new_cap = (output_capacity == 0) ? 1000000 : output_capacity * 2;
        output_buffer = realloc(output_buffer, new_cap * sizeof(uint32_t));
        output_capacity = new_cap;
    }
}

uint32_t serialize(uint32_t mid, uint32_t* v) {
    if (likely(v[mid] != 0)) return v[mid] - 1;
    uint32_t rid = hash_entries[mid].node_index;
    int count = 0;
    uint32_t children[MAX_ALPHABET];
    GaddagNode* rid_node = &node_arena[rid];
    uint32_t curr = rid_node->first_child;
    if (curr != 0) PREFETCH_SIBLING(node_arena[curr].next_sibling);
    while (curr != 0) {
        GaddagNode* curr_node = &node_arena[curr];
        uint32_t next = curr_node->next_sibling;
        if (next != 0) PREFETCH_SIBLING(node_arena[next].next_sibling);
        children[count++] = curr;
        curr = next;
    }
    if (unlikely(count == 0)) { v[mid] = 1; return 0; }
    ensure_out(count);
    uint32_t pos = output_size;
    output_size += count;
    v[mid] = pos + 1;
    for (int i = 0; i < count; i++) {
        uint32_t child_idx = children[i];
        GaddagNode* child = &node_arena[child_idx];
        uint32_t p = serialize(get_minified_id(child->packed), v);
        // Format output: bits 0-23: minified_id, bit 24: hasMore, bit 25: eow, bits 26-31: char_id
        output_buffer[pos + i] = (p & 0xFFFFFF) | 
                                 ((i < (count - 1)) << 24) | // has_more
                                 (get_end_of_word(child->packed) << 25) | 
                                 (get_char_id(child->packed) << 26);
    }
    return pos;
}

uint32_t* convert_dawg_to_gaddag(uint32_t* input, int in_len, int* out_len) {
    reset_memory();
    progress_max_index = 0;
    minified_count = 0;
    last_reported_percent = -5;
    report_progress(0);

    alphabet_len = input[1];
    uint32_t estimated_nodes = input[alphabet_len + 2];
    
    node_arena = malloc(estimated_nodes * sizeof(GaddagNode));
    node_capacity = estimated_nodes;

    // Reuse input buffer for output; grow if needed.
    output_buffer = input;
    output_capacity = (size_t)in_len;
    output_size = 0;

    // Allouer la table de lookup unique au lieu de 4 tableaux
    lookup_table = calloc(LOOKUP_TABLE_SIZE, sizeof(uint32_t));

    memset(last_split_len, 0, sizeof(last_split_len));

    init_node_templates();
    node_arena[0] = node_templates[0];
    node_count = 1;

    for (int i = 1; i <= alphabet_len; i++) {
        uint32_t found = node_count;
        node_arena[node_count++] = node_templates[i];
        *lookup_level0(i) = found;
        node_arena[found].next_sibling = node_arena[0].first_child;
        node_arena[0].first_child = found;
    }
    init_separator_nodes();

    uint8_t word_buffer[MAX_WORD_LEN];
    traverse_source(input, alphabet_len + 3, (uint32_t)in_len, word_buffer, 0);

    // Libérer la table de lookup immédiatement après utilisation
    free(lookup_table);
    lookup_table = NULL;

    init_hash_map(node_count);
    uint32_t rmid = minify(0);
    
    // hash_buckets n'est plus utilisé après minify, libérer immédiatement
    free(hash_buckets);
    hash_buckets = NULL;

    output_size = alphabet_len + 2;

    uint32_t* v = calloc(hash_entry_count + 1, sizeof(uint32_t));
    serialize(rmid, v);
    free(v);
    
    // Libérer hash_entries après serialize
    free(hash_entries);
    hash_entries = NULL;
    
    // Libérer node_arena après sérialisation (output_buffer reuse input, pas node_arena)
    free(node_arena);
    node_arena = NULL;
    node_count = 0;
    node_capacity = 0;

    *out_len = output_size;
    return output_buffer;
}