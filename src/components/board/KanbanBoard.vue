<template>
    <div class="board-wrapper">
        <!-- ── Header (Apple Toolbar) ───────────────────────────────── -->
        <header class="board-header material-thick">
            <div class="header-left">
                <div class="logo">
                    <span class="logo-mark">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <defs>
                                <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#5ac8fa" />
                                    <stop offset="100%" stop-color="#0a84ff" />
                                </linearGradient>
                            </defs>
                            <rect x="3" y="3" width="8" height="18" rx="3" fill="url(#logo-grad)" opacity="0.95"/>
                            <rect x="13" y="3" width="8" height="11" rx="3" fill="url(#logo-grad)" opacity="0.65"/>
                        </svg>
                    </span>
                    <span class="logo-text">{{ projectName }}</span>
                </div>

                <span class="divider-v" aria-hidden="true" />

                <div class="board-name-wrap">
                    <h1 v-if="!editingName" class="board-name" @click="startNameEdit"
                        :title="'Board umbenennen'">
                        {{ board.board.name }}
                    </h1>
                    <input v-else ref="nameInput" v-model="nameValue" class="board-name-input"
                        @keydown.enter="saveName" @keydown.escape="cancelNameEdit" @blur="saveName" />
                </div>
            </div>

            <div class="header-right">
                <!-- Search -->
                <div class="search-wrap">
                    <Icon name="search" :size="14" class="search-icon" />
                    <input v-model="ui.searchQuery" class="search-input" type="search"
                        placeholder="Suchen" />
                    <button v-if="ui.searchQuery" class="search-clear" @click="ui.searchQuery = ''"
                        aria-label="Suche löschen">
                        <Icon name="close" :size="12" />
                    </button>
                </div>

                <!-- Priority filter dots -->
                <div class="priority-filters" role="group" aria-label="Nach Priorität filtern">
                    <button v-for="p in priorities" :key="p.value"
                        :class="['priority-filter-btn', { active: ui.filterPriorities.includes(p.value) }]"
                        :style="{ '--p-color': p.color }" @click="togglePriorityFilter(p.value)"
                        :data-tooltip="p.label" :aria-label="p.label">
                        <span class="p-dot" />
                    </button>
                </div>

                <span class="divider-v" aria-hidden="true" />

                <!-- WS status -->
                <div class="ws-status" :data-tooltip="board.wsConnected ? 'Echtzeit aktiv' : 'Verbinde...'">
                    <span :class="['ws-dot', { disconnected: !board.wsConnected }]" />
                </div>

                <!-- Stats -->
                <button class="header-btn" @click="ui.openStats()" data-tooltip="Statistiken"
                    aria-label="Statistiken">
                    <Icon name="chart" :size="16" />
                </button>

                <!-- AI Panel -->
                <button class="header-btn ai-btn" @click="ui.openAiPanel()" data-tooltip="KI-Aktivität"
                    aria-label="KI-Aktivität">
                    <Icon name="sparkles" :size="16" />
                    <span v-if="ui.aiEvents.length" class="ai-badge">
                        {{ Math.min(ui.aiEvents.length, 99) }}
                    </span>
                </button>

                <!-- Theme toggle -->
                <button class="header-btn" @click="ui.toggleTheme()"
                    :data-tooltip="ui.isDark ? 'Helles Erscheinungsbild' : 'Dunkles Erscheinungsbild'"
                    aria-label="Theme umschalten">
                    <Icon :name="ui.isDark ? 'sun' : 'moon'" :size="16" />
                </button>

                <!-- Add Column -->
                <button class="header-btn header-btn--primary" @click="ui.openColumnCreate()"
                    data-tooltip="Neue Spalte">
                    <Icon name="plus" :size="15" />
                    <span>Spalte</span>
                </button>
            </div>
        </header>

        <!-- ── Filter Active Bar ───────────────────────────────────── -->
        <Transition name="fade">
            <div v-if="ui.hasActiveFilters()" class="filter-bar">
                <Icon name="filter" :size="14" />
                <span class="filter-bar-label">Gefiltert</span>
                <div v-if="ui.filterPriorities.length" class="filter-tags">
                    <span v-for="p in ui.filterPriorities" :key="p" class="tag filter-tag">
                        {{ priorityLabelFor(p) }}
                        <button @click="togglePriorityFilter(p)" aria-label="Filter entfernen">
                            <Icon name="close" :size="10" />
                        </button>
                    </span>
                </div>
                <button class="filter-clear" @click="ui.clearFilters()">Alle Filter löschen</button>
            </div>
        </Transition>

        <!-- ── Loading ─────────────────────────────────────────────── -->
        <div v-if="board.loading" class="loading-screen">
            <div class="loading-spinner" />
            <p>Verbinde mit Server…</p>
        </div>

        <!-- ── Columns Area ───────────────────────────────────────── -->
        <div v-else class="columns-outer">
            <div class="columns-scroll">
                <draggable v-model="localColumns" item-key="id" group="columns" :animation="280"
                    ghost-class="column-ghost" handle=".column-header" class="columns-container"
                    @end="onColumnDragEnd">
                    <template #item="{ element }">
                        <KanbanColumn :column="element" />
                    </template>
                </draggable>

                <button class="add-column-card" @click="ui.openColumnCreate()">
                    <span class="add-col-icon-wrap">
                        <Icon name="plus" :size="18" />
                    </span>
                    <span>Spalte hinzufügen</span>
                </button>
            </div>
        </div>

        <!-- ── Modals ──────────────────────────────────────────────── -->
        <TicketModal v-if="ui.activeModal === 'ticket-create' || ui.activeModal === 'ticket-edit'"
            :model-value="true" @update:model-value="ui.closeModal()" />

        <ColumnModal v-if="ui.activeModal === 'column-create' || ui.activeModal === 'column-edit'"
            :model-value="true" @update:model-value="ui.closeModal()" />

        <BoardStats v-if="ui.activeModal === 'stats'" :model-value="true"
            @update:model-value="ui.closeModal()" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
import type { Column, Priority } from '@/types'
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import KanbanColumn from './KanbanColumn.vue'
import TicketModal from '@/components/editor/TicketModal.vue'
import ColumnModal from '@/components/editor/ColumnModal.vue'
import BoardStats from './BoardStats.vue'
import Icon from '@/components/ui/Icon.vue'

const board = useBoardStore()
const ui = useUiStore()

const projectName = computed(() => {
    const raw: string = __PROJECT_NAME__
    return raw.replace(/^@[^/]+\//, '')
})

// ─── Board name editing ─────────────────────────────────────────────
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

// ─── Column drag ────────────────────────────────────────────────────
const localColumns = ref<Column[]>([])

watch(() => board.sortedColumns, (cols) => {
    localColumns.value = [...cols]
}, { immediate: true })

async function onColumnDragEnd() {
    await board.reorderColumns(localColumns.value)
}

// ─── Priority filter buttons ────────────────────────────────────────
const priorities = [
    { value: 'urgent' as Priority, label: 'Dringend', color: 'var(--priority-urgent)' },
    { value: 'high' as Priority, label: 'Hoch', color: 'var(--priority-high)' },
    { value: 'medium' as Priority, label: 'Mittel', color: 'var(--priority-medium)' },
    { value: 'low' as Priority, label: 'Niedrig', color: 'var(--priority-low)' },
]

function priorityLabelFor(p: string) {
    return priorities.find(x => x.value === p)?.label ?? p
}

function togglePriorityFilter(value: string) {
    const idx = ui.filterPriorities.indexOf(value)
    if (idx === -1) ui.filterPriorities.push(value)
    else ui.filterPriorities.splice(idx, 1)
}

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

/* ── Toolbar ─────────────────────────────────────────────────────── */
.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.625rem 1.25rem;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid var(--separator);
    flex-shrink: 0;
    z-index: 10;
    min-height: 52px;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.header-right {
    flex: 1;
    justify-content: flex-end;
}

/* Vertical divider */
.divider-v {
    width: 1px;
    height: 20px;
    background: var(--separator);
    margin: 0 0.25rem;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.9375rem;
    letter-spacing: -0.018em;
    color: var(--text-primary);
}

.logo-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 1px 2px rgba(10, 132, 255, 0.3));
}

/* Board name */
.board-name {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    white-space: nowrap;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    line-height: 1.3;
}

.board-name:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.board-name-input {
    font-size: 0.9375rem;
    font-weight: 500;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-sm);
    max-width: 280px;
    width: auto;
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
    color: var(--text-tertiary);
    pointer-events: none;
    z-index: 1;
}

.search-input {
    width: 220px;
    padding: 0.375rem 1.875rem 0.375rem 1.875rem;
    font-size: 0.8125rem;
    height: 30px;
    border-radius: var(--radius-md);
    background: var(--input-bg);
    border: 1px solid transparent;
}

.search-input:focus {
    width: 280px;
}

.search-clear {
    position: absolute;
    right: 0.375rem;
    background: var(--surface-elevated);
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 3px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.search-clear:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
}

/* Priority filter (Apple traffic-light style) */
.priority-filters {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--input-bg);
    border-radius: var(--radius-full);
}

.priority-filter-btn {
    width: 22px;
    height: 22px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.priority-filter-btn .p-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--p-color);
    opacity: 0.55;
    transition: all var(--transition-fast);
}

.priority-filter-btn:hover .p-dot {
    opacity: 0.85;
    transform: scale(1.15);
}

.priority-filter-btn.active {
    background: var(--surface-elevated);
}

.priority-filter-btn.active .p-dot {
    opacity: 1;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-color) 28%, transparent);
}

/* WS status */
.ws-status {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
}

/* Header buttons */
.header-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    min-width: 30px;
    padding: 0 0.5rem;
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    gap: 5px;
    font-size: 0.8125rem;
    font-weight: 500;
    font-family: inherit;
    position: relative;
}

.header-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.header-btn:active {
    background: var(--surface-pressed);
    transform: scale(0.96);
}

.header-btn--primary {
    background: var(--accent);
    color: #fff;
    padding: 0 0.75rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

.header-btn--primary:hover {
    background: var(--accent-hover);
    color: #fff;
}

.header-btn--primary:active {
    background: var(--accent-pressed);
    transform: scale(0.96);
}

/* AI button badge */
.ai-btn { position: relative; }

.ai-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: var(--priority-urgent);
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 1.5px solid var(--bg-canvas);
    line-height: 1;
}

/* ── Filter Bar ──────────────────────────────────────────────────── */
.filter-bar {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 1.25rem;
    background: var(--accent-soft);
    border-bottom: 1px solid var(--separator);
    flex-shrink: 0;
    font-size: 0.8125rem;
    color: var(--accent);
}

.filter-bar-label {
    font-weight: 500;
}

.filter-tags {
    display: flex;
    gap: 4px;
}

.filter-tag {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.filter-tag button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-tertiary);
    margin-left: 2px;
    padding: 2px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    transition: all var(--transition-fast);
}

.filter-tag button:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
}

.filter-clear {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    padding: 0;
    font-family: inherit;
}

.filter-clear:hover {
    text-decoration: underline;
}

/* ── Loading ─────────────────────────────────────────────────────── */
.loading-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--text-tertiary);
}

.loading-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid var(--separator);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* ── Columns ─────────────────────────────────────────────────────── */
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
    padding: 1.25rem 1.5rem 1.75rem;
    display: flex;
    gap: 1rem;
    align-items: stretch;
}

.columns-container {
    display: flex;
    gap: 1rem;
    align-items: stretch;
    height: 100%;
    flex: 0 0 auto;
}

/* Add-column placeholder */
.add-column-card {
    flex-shrink: 0;
    width: 296px;
    min-height: 140px;
    border: 1.5px dashed var(--border-hover);
    border-radius: var(--radius-lg);
    background: transparent;
    color: var(--text-tertiary);
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    cursor: pointer;
    transition: all var(--transition-base);
    align-self: flex-start;
    margin-top: 2px;
    font-family: inherit;
}

.add-col-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--surface-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
}

.add-column-card:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-soft);
}

.add-column-card:hover .add-col-icon-wrap {
    background: var(--accent);
    color: #fff;
    transform: scale(1.08);
}
</style>
