# Graph Report - .  (2026-06-14)

## Corpus Check
- Corpus is ~17,880 words - fits in a single context window. You may not need a graph.

## Summary
- 109 nodes · 141 edges · 25 communities (8 shown, 17 thin omitted)
- Extraction: 70% EXTRACTED · 30% INFERRED · 1% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Kanban Board UI|Kanban Board UI]]
- [[_COMMUNITY_Board State & Sync|Board State & Sync]]
- [[_COMMUNITY_REST API & Editor Modals|REST API & Editor Modals]]
- [[_COMMUNITY_Keyboard & Modal Navigation|Keyboard & Modal Navigation]]
- [[_COMMUNITY_Library Build & Config|Library Build & Config]]
- [[_COMMUNITY_Brand Identity|Brand Identity]]
- [[_COMMUNITY_App Bootstrap|App Bootstrap]]
- [[_COMMUNITY_Ticket Formatting|Ticket Formatting]]
- [[_COMMUNITY_App Shell|App Shell]]
- [[_COMMUNITY_Type Board|Type: Board]]
- [[_COMMUNITY_Type Column|Type: Column]]
- [[_COMMUNITY_Type ColumnModalData|Type: ColumnModalData]]
- [[_COMMUNITY_Type FilterState|Type: FilterState]]
- [[_COMMUNITY_Type KanbanMeta|Type: KanbanMeta]]
- [[_COMMUNITY_Type ModalType|Type: ModalType]]
- [[_COMMUNITY_Type Ticket|Type: Ticket]]
- [[_COMMUNITY_Type TicketModalData|Type: TicketModalData]]
- [[_COMMUNITY_Date Formatter|Date Formatter]]
- [[_COMMUNITY_Relative Date Format|Relative Date Format]]
- [[_COMMUNITY_Priority Background Color|Priority Background Color]]
- [[_COMMUNITY_Priority Color|Priority Color]]
- [[_COMMUNITY_Priority Icon|Priority Icon]]
- [[_COMMUNITY_Priority Label|Priority Label]]
- [[_COMMUNITY_Priority Sort Order|Priority Sort Order]]
- [[_COMMUNITY_String-to-Color Util|String-to-Color Util]]

## God Nodes (most connected - your core abstractions)
1. `readData` - 13 edges
2. `writeData` - 11 edges
3. `withSuppressedWatcher` - 10 edges
4. `Kanban board data schema` - 9 edges
5. `toast` - 9 edges
6. `onKeydown` - 8 edges
7. `KanbanBoard component` - 6 edges
8. `Library entry surface` - 6 edges
9. `kanban.json board data` - 5 edges
10. `broadcast` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Keyboard shortcuts` --rationale_for--> `onKeydown`  [INFERRED]
  README.md → src/composables/useKeyboard.ts
- `AI integration via kanban.json` --rationale_for--> `handleWsEvent`  [INFERRED]
  README.md → src/stores/board.ts
- `TK-XXXX ticket numbering` --rationale_for--> `generateTicketNumber`  [INFERRED]
  README.md → src/utils/helpers.ts
- `TK-XXXX ticket numbering` --rationale_for--> `formatTicketId`  [INFERRED]
  README.md → src/utils/helpers.ts
- `getProjectName` --semantically_similar_to--> `__PROJECT_NAME__ constant`  [INFERRED] [semantically similar]
  server/index.mjs → env.d.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Realtime board sync pipeline** — server_index_readdata, server_index_writedata, server_index_broadcast, server_index_filewatcher, server_index_withsuppressedwatcher [INFERRED 0.95]
- **Board interaction flow** — board_kanbanboard_component, board_kanbancolumn_component, board_kanbanticket_component, editor_ticketmodal_component, editor_columnmodal_component, board_boardstats_component [INFERRED 0.85]
- **Board data contract** — kanban_schema_boarddataschema, kanban_boarddata, server_index_defaultdata, board_kanbanboard_component, editor_ticketmodal_component, editor_columnmodal_component [INFERRED 0.95]
- **Public library surface** — src_index_library_entry, stores_board_useboardstore, stores_ui_useuistore, composables_usekeyboard_usekeyboard [EXTRACTED 1.00]
- **Optimistic sync loop** — stores_board_fetchboard, stores_board_connectwebsocket, stores_board_handlewsevent, github_copilot_instructions_optimistic_sync_flow [INFERRED 0.95]
- **Toast feedback system** — ui_toast_toast_component, stores_ui_toast, stores_ui_removetoast, types_index_toast [INFERRED 0.95]

## Communities (25 total, 17 thin omitted)

### Community 0 - "Kanban Board UI"
Cohesion: 0.10
Nodes (24): mykanban CLI entry, BoardStats component, KanbanBoard component, onColumnDragEnd, saveName, togglePriorityFilter, KanbanColumn component, isTicketFiltered (+16 more)

### Community 1 - "Board State & Sync"
Cohesion: 0.15
Nodes (20): Optimistic REST plus WebSocket sync, AI integration via kanban.json, connectWebSocket, createColumn, createTicket, fetchBoard, handleWsEvent, moveTickets (+12 more)

### Community 2 - "REST API & Editor Modals"
Cohesion: 0.24
Nodes (19): save, save, GET /api/board, PATCH /api/board/meta, PUT /api/board, POST /api/columns, DELETE /api/columns/:id, PUT /api/columns/order (+11 more)

### Community 3 - "Keyboard & Modal Navigation"
Cohesion: 0.22
Nodes (9): onKeydown, useKeyboard, Keyboard shortcuts, sortedColumns, closeModal, openColumnCreate, openStats, openTicketCreate (+1 more)

### Community 4 - "Library Build & Config"
Cohesion: 0.43
Nodes (8): Local-first Kanban architecture, @ path alias, Node-side tooling tsconfig, Split TypeScript project references, Library build mode, Library entry surface, useBoardStore, useUiStore

### Community 5 - "Brand Identity"
Cohesion: 0.60
Nodes (5): Workboard Logo, Heraldic Brand Identity, Fleur-de-lis Symbol, Purple-and-White Shield Emblem, Workboard Wordmark

### Community 6 - "App Bootstrap"
Cohesion: 0.67
Nodes (3): HTML app entry document, Root router, Vue app bootstrap

### Community 7 - "Ticket Formatting"
Cohesion: 0.67
Nodes (3): TK-XXXX ticket numbering, formatTicketId, generateTicketNumber

## Ambiguous Edges - Review These
- `@mykanban/board package` → `getProjectName`  [AMBIGUOUS]
  server/index.mjs · relation: references

## Knowledge Gaps
- **39 isolated node(s):** `startServer`, `Board`, `Column`, `Ticket`, `Priority` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `@mykanban/board package` and `getProjectName`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Optimistic REST plus WebSocket sync` connect `Board State & Sync` to `Library Build & Config`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `useBoardStore` connect `Library Build & Config` to `Board State & Sync`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Kanban board data schema` (e.g. with `BoardStats component` and `KanbanBoard component`) actually correct?**
  _`Kanban board data schema` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `startServer`, `Board`, `Column` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Kanban Board UI` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Should `Board State & Sync` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._