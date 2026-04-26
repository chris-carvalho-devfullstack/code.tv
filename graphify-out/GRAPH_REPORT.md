# Graph Report - C:\Users\Christian\Documents\Desenvolvimento\Projetos\code-tv\code-tv  (2026-04-25)

## Corpus Check
- 26 files · ~18,682 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 63 nodes · 64 edges · 18 communities detected
- Extraction: 64% EXTRACTED · 36% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 9 edges
2. `getUser()` - 7 edges
3. `GET()` - 6 edges
4. `processarPedido()` - 6 edges
5. `handleSubmit()` - 4 edges
6. `buscarDadosDoCliente()` - 4 edges
7. `getSessionUser()` - 4 edges
8. `addChave()` - 3 edges
9. `deleteChave()` - 3 edges
10. `handleProduto()` - 3 edges

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
Cohesion: 0.29
Nodes (5): buscarDadosDoCliente(), middleware(), getUser(), checkUserSession(), loadData()

### Community 2 - "Community 2"
Cohesion: 0.47
Nodes (3): handleSubmit(), validarEmail(), validarWhatsAppBR()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (1): handleMascaraTelefone()

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (2): atualizarTela(), iniciarMonitoramento()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (2): getSessionUser(), AdminLayout()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (2): processarPedido(), verificarEstoqueNoBanco()

### Community 7 - "Community 7"
Cohesion: 0.67
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

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 8`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `page.tsx`, `loadEstoque()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `page.tsx`, `handleRegister()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `client.ts`, `createClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `useCartStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 1`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `processarPedido()` connect `Community 6` to `Community 0`, `Community 1`, `Community 2`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `getUser()` connect `Community 1` to `Community 5`, `Community 6`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `createClient()` (e.g. with `AdminDashboard()` and `addChave()`) actually correct?**
  _`createClient()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `getUser()` (e.g. with `middleware()` and `processarPedido()`) actually correct?**
  _`getUser()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `addChave()` and `deleteChave()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `processarPedido()` (e.g. with `createClient()` and `GET()`) actually correct?**
  _`processarPedido()` has 5 INFERRED edges - model-reasoned connections that need verification._