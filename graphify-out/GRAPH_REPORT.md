# Graph Report - C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv  (2026-04-25)

## Corpus Check
- 25 files · ~17,765 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 59 edges · 17 communities detected
- Extraction: 66% EXTRACTED · 34% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
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
1. `createClient()` - 8 edges
2. `GET()` - 6 edges
3. `processarPedido()` - 6 edges
4. `getUser()` - 6 edges
5. `handleSubmit()` - 4 edges
6. `getSessionUser()` - 4 edges
7. `addChave()` - 3 edges
8. `deleteChave()` - 3 edges
9. `handleProduto()` - 3 edges
10. `deleteProduto()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `middleware()` --calls--> `getUser()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\middleware.ts → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\components\Navbar.tsx
- `AdminDashboard()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\admin\page.tsx → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts
- `GET()` --calls--> `processarPedido()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\api\estoque\route.ts → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\checkout\actions.ts
- `processarPedido()` --calls--> `createClient()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\checkout\actions.ts → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\supabase\server.ts
- `processarPedido()` --calls--> `verificarEstoqueNoBanco()`  [INFERRED]
  C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\app\checkout\actions.ts → C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv\src\lib\estoque.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (7): addChave(), AdminDashboard(), deleteChave(), deleteProduto(), handleProduto(), GET(), createClient()

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (6): getSessionUser(), AdminLayout(), middleware(), getUser(), checkUserSession(), loadData()

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
Cohesion: 0.5
Nodes (2): processarPedido(), verificarEstoqueNoBanco()

### Community 6 - "Community 6"
Cohesion: 0.67
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
- **Thin community `Community 7`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `page.tsx`, `loadEstoque()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `page.tsx`, `handleRegister()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `client.ts`, `createClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `useCartStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `processarPedido()` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `getUser()` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 0` to `Community 1`, `Community 5`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `createClient()` (e.g. with `AdminDashboard()` and `addChave()`) actually correct?**
  _`createClient()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `addChave()` and `deleteChave()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `processarPedido()` (e.g. with `createClient()` and `GET()`) actually correct?**
  _`processarPedido()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `getUser()` (e.g. with `middleware()` and `processarPedido()`) actually correct?**
  _`getUser()` has 5 INFERRED edges - model-reasoned connections that need verification._