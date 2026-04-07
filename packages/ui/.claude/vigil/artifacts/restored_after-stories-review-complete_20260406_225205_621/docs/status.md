# Component Review Status

Components are reviewed in alphabetical order starting from `empty`.  
Components before `empty` (accordion → dropdown-menu) were handled manually in earlier sessions.

## Legend
- ✅ Done — stories verified/fixed, no component changes needed
- 🔧 Done — stories verified/fixed + component source modified
- ⏭ Skipped — could not retrieve doc info after 5 attempts
- ❌ Error — blocked by an unresolvable issue
- ⏳ Pending

## Components

| Component | Status | Notes |
|---|---|---|
| empty | ✅ | Tabler icons remplacés par lucide equivalents (CloudIcon, BellIcon) |
| field | ✅ | Stories créées de zéro (10 stories) |
| form | ⏭ | Page de guide sans section #examples — composant de composition (Superforms/Zod) |
| hover-card | ✅ | Stories corrigées (openDelay, trigger label, content classes, sides order) |
| input | ✅ | Stories réécrites (13 stories) — aria-invalid, label/select association fixes |
| input-group | ✅ | Stories créées de zéro (8 stories) — tabler icons → lucide, hook copy → $state |
| input-otp | ✅ | Stories réécrites (7 stories) — API cells-based, REGEXP → inputmode, aria-invalid fixes |
| item | ✅ | Stories créées de zéro (7 stories) — asChild pattern, `children` prop fix in item.svelte |
| kbd | ✅ | Stories réécrites (4 stories) — Group, Button, Tooltip, Input Group |
| label | 🔧 | With Checkbox : Field.Field retiré → div.flex.gap-2 (doc shadcn) |
| menubar | 🔧 | Checkbox+Format, Radio+Theme, With Icons réécrites (icônes + structure doc shadcn) |
| native-select | 🔧 | Custom — stories corrigées ({#snippet template()} ajouté) |
| navigation-menu | ✅ | Réinstallé. Stories OK — doc shadcn n'a qu'un seul exemple (preview + RTL) |
| pagination | ⏭ | Réinstallé. "Simple" OK. "Icons Only" : code non récupérable après 5 tentatives (lazy-load). Screenshot montre Select "Rows per page" + Prev/Next — notre story n'a que Prev/Next |
| popover | ✅ | Stories déjà correctes (3 stories) |
| progress | ✅ | Stories réécrites (2 stories) — Label + Controlled avec Slider |
| radio-group | ✅ | Stories réécrites (5 stories) — Basic, Description, Fieldset, Disabled, Invalid |
| range-calendar | ✅ | Stories déjà correctes (7 stories) |
| resizable | 🔧 | Stories réécrites (3 stories) — Horizontal avec nested vertical group (One/Two/Three), Vertical 25/75, Handle 25/75 |
| scroll-area | 🔧 | Horizontal story : whitespace-nowrap + ScrollAreaScrollbar ajoutés |
| select | ⏭ | 5 stories (Align Item With Trigger, Groups, Scrollable, Disabled, Invalid) — noms corrects, contenu non vérifiable (blocs tronqués) |
| separator | 🔧 | Stories réécrites (3 stories) — Vertical, Menu (Settings/Account/Help), List (Item 1/2/3) |
| sheet | ⏭ | 2 stories (Side, No Close Button) — noms corrects, contenu non vérifiable (blocs tronqués) |
| sidebar | ✅ | Stories déjà correctes |
| skeleton | 🔧 | Stories réécrites (5 stories) — Avatar, Card, Text, Form, Table selon doc |
| slider | ⏭ | 5 stories (Range, Multiple Thumbs, Vertical, Controlled, Disabled) — noms corrects, contenu non vérifiable (blocs tronqués) |
| sonner | 🔧 | Stories réécrites (3 stories) — Types (6 boutons incl. Promise), Description, Position (boutons individuels par position) |
| spinner | 🔧 | Custom — stories corrigées ({#snippet template()} ajouté, component ajouté à defineMeta) |
| switch | 🔧 | Stories réécrites (5 stories) — Description, Choice Card, Disabled, Invalid, Size selon doc |
| table | 🔧 | Stories réécrites (2 stories) — Footer (slice 0..3), Actions avec loop |
| tabs | ⏭ | 4 stories (Line, Vertical, Disabled, Icons) — noms corrects, contenu non vérifiable (blocs tronqués) |
| textarea | 🔧 | Stories réécrites (4 stories) — Field, Disabled, Invalid, Button selon doc |
| toggle | 🔧 | Stories réécrites (4 stories) — Outline, With Text, Size, Disabled selon doc |
| toggle-group | 🔧 | Stories réécrites (6 stories) — Outline, Size, Spacing, Vertical, Disabled, Custom selon doc |
| tooltip | 🔧 | Stories réécrites (3 stories) — Side, With Keyboard Shortcut, Disabled Button selon doc |
| typography | ✅ | Stories déjà correctes |
