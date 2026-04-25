# Graph Report - C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv  (2026-04-20)

## Corpus Check
- 22 files · ~11,789 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 53 nodes · 45 edges · 17 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 7 edges
2. `getUser()` - 5 edges
3. `processarPedido()` - 4 edges
4. `handleSubmit()` - 4 edges
5. `middleware()` - 2 edges
6. `AdminDashboard()` - 2 edges
7. `addChave()` - 2 edges
8. `deleteChave()` - 2 edges
9. `handleProduto()` - 2 edges
10. `deleteProduto()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `middleware()` --calls--> `getUser()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\middleware.ts → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\components\Navbar.tsx
- `AdminDashboard()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\admin\page.tsx → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts
- `addChave()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\admin\chaves\page.tsx → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts
- `deleteChave()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\admin\chaves\page.tsx → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts
- `handleProduto()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\admin\produtos\page.tsx → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (6): addChave(), AdminDashboard(), deleteChave(), deleteProduto(), handleProduto(), createClient()

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (5): processarPedido(), middleware(), getUser(), checkUserSession(), loadData()

### Community 2 - "Community 2"
Cohesion: 0.47
Nodes (3): handleSubmit(), validarEmail(), validarWhatsAppBR()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (1): handleMascaraTelefone()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 5`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `layout.tsx`, `AdminLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `page.tsx`, `handleRegister()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `CartDrawer.tsx`, `formatCurrency()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `client.ts`, `createClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `useCartStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `processarPedido()` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `createClient()` (e.g. with `AdminDashboard()` and `addChave()`) actually correct?**
  _`createClient()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getUser()` (e.g. with `middleware()` and `processarPedido()`) actually correct?**
  _`getUser()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `processarPedido()` (e.g. with `createClient()` and `getUser()`) actually correct?**
  _`processarPedido()` has 3 INFERRED edges - model-reasoned connections that need verification._