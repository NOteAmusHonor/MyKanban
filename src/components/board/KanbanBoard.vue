<template>
    <div class="board-wrapper">
        <!-- ── Header ─────────────────────────────────────────────────── -->
        <header class="board-header glass">
            <div class="header-left">
                <div class="logo">
                    <span class="logo-icon">⬚</span>
                    <span class="logo-text">WorkBoard</span>
                </div>
                <div class="project-name-badge">
                    {{ projectName }}
                </div>
                <div class="board-name-wrap">
                    <h1 v-if="!editingName" class="board-name" @click="startNameEdit" :title="'Board umbenennen'">
                        {{ board.board.name }}
                    </h1>
                    <input v-else ref="nameInput" v-model="nameValue" class="board-name-input" @keydown.enter="saveName"
                        @keydown.escape="cancelNameEdit" @blur="saveName" />
                </div>
            </div>

            <div class="header-right">
                <!-- WS status -->
                <div class="ws-status" :data-tooltip="board.wsConnected ? 'Echtzeit aktiv' : 'Verbinde...'">
                    <span :class="['ws-dot', { disconnected: !board.wsConnected }]" />
                    <span class="ws-label">{{ board.wsConnected ? 'Live' : 'Offline' }}</span>
                </div>

                <!-- Search -->
                <div class="search-wrap">
                    <span class="search-icon">🔍</span>
                    <input v-model="ui.searchQuery" class="search-input" type="search"
                        placeholder="Suchen… (TK-1234, Titel, Label)" />
                    <button v-if="ui.searchQuery" class="search-clear" @click="ui.searchQuery = ''">✕</button>
                </div>

                <!-- Filter priorities -->
                <div class="priority-filters">
                    <button v-for="p in priorities" :key="p.value"
                        :class="['priority-filter-btn', { active: ui.filterPriorities.includes(p.value) }]"
                        :style="{ '--p-color': p.color }" @click="togglePriorityFilter(p.value)"
                        :data-tooltip="p.label">
                        {{ p.icon }}
                    </button>
                </div>

                <!-- Stats -->
                <button class="header-btn" @click="ui.openStats()" data-tooltip="Statistiken">
                    📊
                </button>

                <!-- AI Panel -->
                <button class="header-btn ai-btn" :class="{ 'ai-btn--active': ui.aiEvents.length > 0 }"
                    @click="ui.openAiPanel()" data-tooltip="KI-Aktivität">
                    <span class="ai-icon">🤖</span>
                    <span v-if="ui.aiEvents.length" class="ai-badge">{{ Math.min(ui.aiEvents.length, 99) }}</span>
                </button>

                <!-- Add Column -->
                <button class="header-btn add-col-btn" @click="ui.openColumnCreate()" data-tooltip="Neue Spalte">
                    <span>＋ Spalte</span>
                </button>

                <!-- Theme toggle -->
                <button class="header-btn theme-btn" @click="ui.toggleTheme()"
                    :data-tooltip="ui.isDark ? 'Helles Theme' : 'Dunkles Theme'">
                    {{ ui.isDark ? '☀️' : '🌙' }}
                </button>
            </div>
        </header>

        <!-- ── Filter Active Bar ───────────────────────────────────────── -->
        <div v-if="ui.hasActiveFilters()" class="filter-bar">
            <span class="filter-bar-label">🔎 Gefiltert</span>
            <div v-if="ui.filterPriorities.length" class="filter-tags">
                <span v-for="p in ui.filterPriorities" :key="p" class="tag">
                    {{ p }}
                    <button @click="togglePriorityFilter(p)">✕</button>
                </span>
            </div>
            <button class="filter-clear" @click="ui.clearFilters()">Alle Filter löschen</button>
        </div>

        <!-- ── Loading ─────────────────────────────────────────────────── -->
        <div v-if="board.loading" class="loading-screen">
            <div class="loading-spinner" />
            <p>Verbinde mit Server…</p>
        </div>

        <!-- ── Column Area ─────────────────────────────────────────────── -->
        <div v-else class="columns-outer">
            <div class="columns-scroll">
                <draggable v-model="localColumns" item-key="id" group="columns" :animation="250"
                    ghost-class="column-ghost" handle=".column-header" class="columns-container" @end="onColumnDragEnd">
                    <template #item="{ element }">
                        <KanbanColumn :column="element" />
                    </template>
                </draggable>

                <!-- Add Column placeholder -->
                <button class="add-column-card" @click="ui.openColumnCreate()">
                    <span class="add-col-icon">＋</span>
                    <span>Spalte hinzufügen</span>
                </button>
            </div>
        </div>

        <!-- ── Modals ──────────────────────────────────────────────────── -->
        <TicketModal v-if="ui.activeModal === 'ticket-create' || ui.activeModal === 'ticket-edit'" :model-value="true"
            @update:model-value="ui.closeModal()" />

        <ColumnModal v-if="ui.activeModal === 'column-create' || ui.activeModal === 'column-edit'" :model-value="true"
            @update:model-value="ui.closeModal()" />

        <BoardStats v-if="ui.activeModal === 'stats'" :model-value="true" @update:model-value="ui.closeModal()" />

        <AiPanel v-if="ui.activeModal === 'ai'" :model-value="true" @update:model-value="ui.closeModal()" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
import type { Column } from '@/types'
import type { Priority } from '@/types'
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import KanbanColumn from './KanbanColumn.vue'
import TicketModal from '@/components/editor/TicketModal.vue'
import ColumnModal from '@/components/editor/ColumnModal.vue'
import BoardStats from './BoardStats.vue'

const board = useBoardStore()
const ui = useUiStore()

// Projektname aus package.json (via vite define)
const projectName = computed(() => {
    const raw: string = __PROJECT_NAME__
    // "@mykanban/board" → "mykanban/board", "@scope/name" → "name"
    return raw.replace(/^@[^/]+\//, '')
})

// ─── Board name editing ─────────────────────────────────────────────────
const editingName = ref(false)
const nameValue = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

function startNameEdit() {
    nameValue.value = board.board.name
    editingName.value = true
    nextTick(() => nameInput.value?.focus())
}

async function saveName() {
    if (nameValue.value.trim() && nameValue.value !== board.board.name) {
        await board.updateBoardName(nameValue.value.trim())
    }
    editingName.value = false
}

function cancelNameEdit() {
    editingName.value = false
}

// ─── Column drag ────────────────────────────────────────────────────────
const localColumns = ref<Column[]>([])

watch(() => board.sortedColumns, (cols) => {
    localColumns.value = [...cols]
}, { immediate: true })

async function onColumnDragEnd() {
    await board.reorderColumns(localColumns.value)
}

// ─── Priority filter buttons ─────────────────────────────────────────────
const priorities = [
    { value: 'urgent' as Priority, label: 'Dringend', icon: '🔴', color: '#ef4444' },
    { value: 'high' as Priority, label: 'Hoch', icon: '🟠', color: '#f97316' },
    { value: 'medium' as Priority, label: 'Mittel', icon: '🔵', color: '#3b82f6' },
    { value: 'low' as Priority, label: 'Niedrig', icon: '🟢', color: '#22c55e' },
]

function togglePriorityFilter(value: string) {
    const idx = ui.filterPriorities.indexOf(value)
    if (idx === -1) ui.filterPriorities.push(value)
    else ui.filterPriorities.splice(idx, 1)
}

// ─── Initial load ────────────────────────────────────────────────────────
onMounted(() => board.fetchBoard())
</script>

<style scoped>
.board-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
}

/* ── Header ─────────────────────────────────────────────────────────── */
.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    z-index: 10;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.0625rem;
    letter-spacing: -0.02em;
}

.logo-icon {
    font-size: 1.3rem;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.logo-text {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.project-name-badge {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 0.2rem 0.65rem;
    letter-spacing: 0.01em;
    white-space: nowrap;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.board-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
    white-space: nowrap;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.board-name:hover {
    background: var(--surface-elevated);
}

.board-name-input {
    font-size: 0.9375rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    max-width: 280px;
    height: auto;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    justify-content: flex-end;
}

/* WS status */
.ws-status {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: default;
}

.ws-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
}

/* Search */
.search-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 0.625rem;
    font-size: 0.75rem;
    pointer-events: none;
}

.search-input {
    width: 200px;
    padding: 0.375rem 2rem 0.375rem 1.875rem;
    font-size: 0.8125rem;
    height: auto;
    border-radius: var(--radius-full);
}

.search-clear {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

/* Priority filter */
.priority-filters {
    display: flex;
    gap: 3px;
}

.priority-filter-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: transparent;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.priority-filter-btn:hover {
    background: var(--surface-elevated);
}

.priority-filter-btn.active {
    background: var(--surface-elevated);
    border-color: var(--p-color, var(--accent));
    box-shadow: 0 0 8px var(--p-color, var(--accent-glow));
}

/* Header buttons */
.header-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    min-width: 32px;
    padding: 0 0.625rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    gap: 5px;
}

.header-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
    border-color: var(--border-hover);
}

.add-col-btn {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
    color: var(--text-accent);
    font-size: 0.8125rem;
    font-weight: 500;
}

.add-col-btn:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.5);
}

/* AI button */
.ai-btn {
    position: relative;
}

.ai-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--accent);
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
}

/* ── Filter bar ─────────────────────────────────────────────────────── */
.filter-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1.5rem;
    background: rgba(99, 102, 241, 0.06);
    border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    flex-shrink: 0;
    font-size: 0.8125rem;
}

.filter-bar-label {
    color: var(--text-accent);
    font-weight: 500;
}

.filter-tags {
    display: flex;
    gap: 4px;
}

.filter-tags .tag button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    margin-left: 4px;
    font-size: 0.625rem;
}

.filter-clear {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--text-accent);
    cursor: pointer;
    font-size: 0.8125rem;
    text-decoration: underline;
}

/* ── Loading ─────────────────────────────────────────────────────────── */
.loading-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--text-muted);
}

.loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* ── Columns ─────────────────────────────────────────────────────────── */
.columns-outer {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
}

.columns-scroll {
    position: absolute;
    inset: 0;
    overflow-x: auto;
    overflow-y: visible;
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: stretch;
}

.columns-scroll::-webkit-scrollbar {
    height: 6px;
}

/* vuedraggable wrapper */
.columns-container {
    display: flex;
    gap: 1rem;
    align-items: stretch;
    height: 100%;
    flex: 0 0 auto;
}

/* Add-column placeholder card */
.add-column-card {
    flex-shrink: 0;
    width: 280px;
    height: 120px;
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all var(--transition-base);
    margin-top: 2px;
}

.add-column-card:hover {
    border-color: var(--accent);
    color: var(--text-accent);
    background: rgba(99, 102, 241, 0.04);
    box-shadow: var(--shadow-glow);
}

.add-col-icon {
    font-size: 1.5rem;
    line-height: 1;
}
</style>