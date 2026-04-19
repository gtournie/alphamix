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

// Set by any allocation helper that fails. Checked by callers before they touch
// the global buffers, and by `convert_dawg_to_gaddag` before returning. Keeps
// error propagation local (no bool returns threaded through every function) at
// the cost of a single branch per caller after each grow.
static bool conversion_failed = false;

// Grows `node_arena` when `node_count` is about to hit `node_capacity`. The JS-side
// estimate (Σ len·(len+1)) is normally a loose upper bound thanks to GADDAG dedup,
// but it omits pre-seeded nodes (root self + `alphabet_len - 1` root children +
// separator nodes), and can be wrong under pathological dictionaries. Safer to
// grow on demand than to hope. All in-arena references are indices, not pointers,
// so a realloc is safe as long as no caller has cached a `&node_arena[i]` pointer
// across the call — which is the case in the insertion paths that call this.
//
// On realloc failure we write through a temp pointer (so the old arena isn't
// orphaned by an overwrite with NULL) and set `conversion_failed`. `node_capacity`
// is bumped only AFTER a successful realloc; without this, the next ensure_node
// would see `node_count < node_capacity` and skip the grow → silent NULL deref.
static inline void ensure_node(void) {
    if (unlikely(node_count >= node_capacity)) {
        size_t new_cap = node_capacity == 0 ? 1 : node_capacity * 2;
        GaddagNode* tmp = realloc(node_arena, new_cap * sizeof(GaddagNode));
        if (unlikely(!tmp)) { conversion_failed = true; return; }
        node_arena = tmp;
        node_capacity = new_cap;
    }
}

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

// Input-buffer ownership tracking.
// `output_buffer` starts as the caller's input (see `convert_dawg_to_gaddag`), so
// any `realloc(output_buffer, ...)` that MOVES the buffer effectively frees the
// input. The JS wrapper needs to know this to avoid double-freeing inPtr on
// failure paths. These two statics are set at convert entry and updated inside
// `ensure_out`; the convert function copies `input_was_freed` into the out-param
// `*input_consumed` before every return.
static uint32_t* input_original_ptr = NULL;
static int input_was_freed = 0;

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
    // Ownership/failure flags must live here, alongside the allocator state they
    // refer to. Previously `convert_dawg_to_gaddag` reset them a few lines AFTER
    // calling reset_memory() — any code added between those two points (progress
    // callback, logging, future early-exit) would observe stale values from the
    // previous run. `input_original_ptr` is re-set to the caller's `input` on
    // entry, but zeroed here as a defensive default.
    conversion_failed = false;
    input_was_freed = 0;
    input_original_ptr = NULL;
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
                ensure_node();
                if (unlikely(conversion_failed)) return;
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
                ensure_node();
                if (unlikely(conversion_failed)) return;
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
                ensure_node();
                if (unlikely(conversion_failed)) return;
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
                ensure_node();
                if (unlikely(conversion_failed)) return;
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
                ensure_node();
                if (unlikely(conversion_failed)) return;
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
    for (int i = 1; i < (int)alphabet_len; i++) {
        uint32_t root = *lookup_level0(i);
        if (likely(root)) {
            ensure_node();
            if (unlikely(conversion_failed)) return;
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
    // Guard `word[depth] = …` below: `word_buffer` is declared `uint8_t[MAX_WORD_LEN]`
    // so valid depths are 0..MAX_WORD_LEN-1. A malformed DAWG with a chain deeper
    // than MAX_WORD_LEN would otherwise overflow the stack buffer and corrupt
    // callers' frames. Note: we silently drop any word longer than MAX_WORD_LEN;
    // that's acceptable because dictionary sources are bounded to the grid size (15).
    if (depth >= MAX_WORD_LEN) return;
    if (unlikely(conversion_failed)) return;
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
                if (unlikely(conversion_failed)) return;
            }
        }

        if (child_ptr != 0) {
            traverse_source(data, child_ptr, max_len, word, depth + 1);
            if (unlikely(conversion_failed)) return;
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
    if (unlikely(!hash_buckets || !hash_entries)) { conversion_failed = true; return; }
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
        size_t new_cap = hash_entry_capacity * 2;
        HashEntry* tmp = realloc(hash_entries, new_cap * sizeof(HashEntry));
        if (unlikely(!tmp)) { conversion_failed = true; return 0; }
        hash_entries = tmp;
        hash_entry_capacity = new_cap;
    }
    hash_entries[nid].node_index = idx;
    hash_entries[nid].next = hash_buckets[bucket];
    hash_buckets[bucket] = nid;
    set_minified_id(&node->packed, nid);
    return nid;
}

// Same realloc-safety treatment as `ensure_node`: route through a temp pointer so
// the old buffer isn't leaked on failure, and only bump capacity after success.
// On failure, the caller's input is still live (realloc didn't move it), so we
// leave `input_was_freed` alone — the JS wrapper will free `inPtr` itself.
void ensure_out(size_t n) {
    if (unlikely(output_size + n >= output_capacity)) {
        size_t new_cap = (output_capacity == 0) ? 1000000 : output_capacity * 2;
        uint32_t* old_buf = output_buffer;
        uint32_t* tmp = realloc(output_buffer, new_cap * sizeof(uint32_t));
        if (unlikely(!tmp)) { conversion_failed = true; return; }
        output_buffer = tmp;
        // If realloc moved the buffer AND the old location was the caller's input,
        // that input buffer was freed by realloc. Record it so the JS wrapper won't
        // try to `_free(inPtr)` later — that would be a double-free.
        if (output_buffer != old_buf && old_buf == input_original_ptr) {
            input_was_freed = 1;
        }
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
    if (unlikely(conversion_failed)) return 0;
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

/**
 * Converts a DAWG (input) to a GADDAG (output). Reuses the input buffer as the
 * initial output buffer to avoid doubling the peak memory footprint.
 *
 * Ownership contract with the JS caller:
 *   - On SUCCESS (returns non-NULL): the returned pointer is the owned buffer.
 *     If `*input_consumed == 0`, it equals `input` (no realloc happened); if
 *     `*input_consumed == 1`, realloc moved the buffer and the original input
 *     address has been freed. Either way, the JS caller frees exactly the
 *     returned pointer.
 *   - On FAILURE (returns NULL): the JS caller reads `*input_consumed` and
 *     frees `input` iff it is 0. `*input_consumed == 1` means realloc took
 *     ownership at some point before the failure, so `input` is dangling.
 */
// Sanity cap on `estimated_nodes` read from the (untrusted) DAWG header. 2^28
// nodes * 12 bytes/node = 3 GB, well beyond any realistic dictionary — anything
// bigger is a corrupted or adversarial input. Gives us a cheap bound on the
// initial `malloc(estimated_nodes * sizeof(GaddagNode))` without rejecting any
// realistic alphabet.
#define MAX_ESTIMATED_NODES (1u << 28)

uint32_t* convert_dawg_to_gaddag(uint32_t* input, int in_len, int alphabet_len_arg, int* input_consumed, int* out_len) {
    // reset_memory() now also zeros conversion_failed / input_was_freed /
    // input_original_ptr — we only need to set `input_original_ptr` to the
    // caller-provided `input` here. Any realloc inside ensure_out that MOVES
    // output_buffer away from input_original_ptr will flip input_was_freed to 1.
    reset_memory();
    progress_max_index = 0;
    minified_count = 0;
    last_reported_percent = -5;
    report_progress(0);

    input_original_ptr = input;
    *input_consumed = 0;

    // Hard cap: MAX_ALPHABET sizes the static lookup tables (node_templates,
    // separator_nodes, last_split_* caches). An alphabet bigger than this would
    // overrun them. The JS wrapper mirrors this check and throws with a proper
    // error message; the C side returns NULL as a defense in depth.
    if (alphabet_len_arg <= 0 || alphabet_len_arg > MAX_ALPHABET) {
        *input_consumed = input_was_freed;
        return NULL;
    }
    // Input sanity: need at least the header word, and `estimated_nodes` must be
    // a believable allocation target. A malformed .bin with `in_len < 1` would
    // read past the buffer; `estimated_nodes == 0` would malloc(0) (impl-defined);
    // a huge value would either OOM gracefully via malloc or, in theory, succeed
    // and blow memory on subsequent allocs.
    if (in_len < 1) {
        *input_consumed = input_was_freed;
        return NULL;
    }
    alphabet_len = (uint8_t)alphabet_len_arg;
    // DAWG layout: [estimatedGaddagNodes, ...nodes]. Pointers inside nodes are
    // absolute indices into this same buffer, so root's first child lives at 1
    // (and position 0 is the estimated-nodes header word).
    uint32_t estimated_nodes = input[0];
    if (estimated_nodes == 0 || estimated_nodes > MAX_ESTIMATED_NODES) {
        *input_consumed = input_was_freed;
        return NULL;
    }

    node_arena = malloc((size_t)estimated_nodes * sizeof(GaddagNode));
    if (!node_arena) goto fail;
    node_capacity = estimated_nodes;

    // Reuse input buffer for output; grow if needed.
    output_buffer = input;
    output_capacity = (size_t)in_len;
    output_size = 0;

    // Allouer la table de lookup unique au lieu de 4 tableaux
    lookup_table = calloc(LOOKUP_TABLE_SIZE, sizeof(uint32_t));
    if (!lookup_table) goto fail;

    memset(last_split_len, 0, sizeof(last_split_len));

    init_node_templates();
    node_arena[0] = node_templates[0];
    node_count = 1;

    // alphabet_len = ID_TO_CHAR.length (letters + separator). Real letter ids are [1..alphabet_len-1].
    for (int i = 1; i < alphabet_len; i++) {
        ensure_node();
        if (conversion_failed) goto fail;
        uint32_t found = node_count;
        node_arena[node_count++] = node_templates[i];
        *lookup_level0(i) = found;
        node_arena[found].next_sibling = node_arena[0].first_child;
        node_arena[0].first_child = found;
    }
    init_separator_nodes();
    if (conversion_failed) goto fail;

    uint8_t word_buffer[MAX_WORD_LEN];
    traverse_source(input, 1, (uint32_t)in_len, word_buffer, 0);
    if (conversion_failed) goto fail;

    // Libérer la table de lookup immédiatement après utilisation
    free(lookup_table);
    lookup_table = NULL;

    init_hash_map(node_count);
    if (conversion_failed) goto fail;
    uint32_t rmid = minify(0);
    if (conversion_failed) goto fail;

    // hash_buckets n'est plus utilisé après minify, libérer immédiatement
    free(hash_buckets);
    hash_buckets = NULL;

    // Reserve output_buffer[0] as a sentinel so that "pointer == 0" in any
    // serialized node unambiguously means "no children". Root's first child
    // sibling chain then starts at index 1 (== rootIdx on the JS side).
    ensure_out(1);
    if (conversion_failed) goto fail;
    output_buffer[0] = 0;
    output_size = 1;

    uint32_t* v = calloc(hash_entry_count + 1, sizeof(uint32_t));
    if (!v) goto fail;
    serialize(rmid, v);
    free(v);
    if (conversion_failed) goto fail;

    // Libérer hash_entries après serialize
    free(hash_entries);
    hash_entries = NULL;

    // Libérer node_arena après sérialisation (output_buffer reuse input, pas node_arena)
    free(node_arena);
    node_arena = NULL;
    node_count = 0;
    node_capacity = 0;

    *out_len = output_size;
    *input_consumed = input_was_freed;
    // Transfer ownership of `output_buffer` to the caller. Null-out the global
    // so a subsequent convert run's `reset_memory()` doesn't re-`free()` this
    // pointer — the JS wrapper calls `_free(outPtr)` after copying the data
    // out, which would otherwise collide with that free into a double-free.
    uint32_t* ret = output_buffer;
    output_buffer = NULL;
    output_capacity = 0;
    output_size = 0;
    return ret;

fail:
    // Consolidated error epilogue. Frees any partially-allocated state while
    // preserving the `input_consumed` contract: if realloc ever moved the output
    // buffer away from the caller's input, input_was_freed == 1 and `output_buffer`
    // now owns the memory that came from `input`. Freeing `output_buffer` here is
    // therefore safe; the JS wrapper will see `input_consumed == 1` and skip its
    // own `_free(inPtr)` to avoid a double-free.
    //
    // If realloc never moved, `output_buffer == input` (the caller's memory). We
    // must NOT free it here — the JS wrapper, seeing `input_consumed == 0`, will
    // free `inPtr` itself. Detect this case by comparing against `input_original_ptr`.
    if (output_buffer && output_buffer != input_original_ptr) {
        free(output_buffer);
    }
    output_buffer = NULL;
    output_capacity = 0;
    output_size = 0;
    if (lookup_table) { free(lookup_table); lookup_table = NULL; }
    if (node_arena) { free(node_arena); node_arena = NULL; node_count = 0; node_capacity = 0; }
    if (hash_buckets) { free(hash_buckets); hash_buckets = NULL; }
    if (hash_entries) { free(hash_entries); hash_entries = NULL; }
    *input_consumed = input_was_freed;
    return NULL;
}