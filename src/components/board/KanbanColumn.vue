<template>
    <div class="column-wrap">
        <div class="column glass">
            <!-- Column Header -->
            <div class="column-header">
                <div class="column-accent" :style="{ background: column.color }" />
                <div class="column-title-row">
                    <span class="column-title">{{ column.title }}</span>
                    <span class="column-count">{{ columnTickets.length }}</span>
                </div>
                <div class="column-actions">
                    <button class="col-btn" @click="ui.openTicketCreate(column.id)" data-tooltip="Ticket hinzufügen">
                        ＋
                    </button>
                    <button class="col-btn" @click="ui.openColumnEdit(column)" data-tooltip="Spalte bearbeiten">
                        ⋯
                    </button>
                </div>
            </div>

            <!-- Ticket List (draggable) -->
            <draggable :list="localTickets" item-key="id" group="tickets" :animation="200" ghost-class="ticket-ghost"
                drag-class="ticket-drag" class="column-tickets"
                :class="{ 'column-tickets--empty': !columnTickets.length }" @change="onDragChange">
                <template #item="{ element }">
                    <KanbanTicket :key="element.id" :ticket="element" :is-filtered="isTicketFiltered(element)" />
                </template>
                <template #footer>
                    <div v-if="!columnTickets.length" class="empty-state">
                        <span class="empty-icon">📋</span>
                        <span>Kein Ticket</span>
                        <button class="add-first-btn" @click="ui.openTicketCreate(column.id)">
                            + Ticket hinzufügen
                        </button>
                    </div>
                </template>
            </draggable>

            <!-- Add Ticket Button (bottom) -->
            <button class="column-add-btn" @click="ui.openTicketCreate(column.id)">
                <span>＋</span>
                <span>Ticket</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import type { Column, Ticket } from '@/types'
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import KanbanTicket from './KanbanTicket.vue'

const props = defineProps<{ column: Column }>()

const board = useBoardStore()
const ui = useUiStore()

// Local reactive copy for vuedraggable (needed because computed readonly won't work with draggable)
const localTickets = ref<Ticket[]>([])

const columnTickets = computed(() =>
    board.tickets
        .filter(t => t.columnId === props.column.id)
        .sort((a, b) => a.order - b.order),
)

// Keep localTickets in sync with store
watch(columnTickets, (val) => {
    localTickets.value = [...val]
}, { immediate: true })

// Filter logic (dim tickets that don't match, not remove them)
function isTicketFiltered(ticket: Ticket): boolean {
    const { searchQuery, filterPriorities, filterLabels } = ui

    if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches =
            ticket.title.toLowerCase().includes(q) ||
            ticket.description.toLowerCase().includes(q) ||
            `tk-${ticket.ticketNumber}`.includes(q) ||
            ticket.labels.some(l => l.toLowerCase().includes(q))
        if (!matches) return true
    }

    if (filterPriorities.length && !filterPriorities.includes(ticket.priority)) return true
    if (filterLabels.length && !ticket.labels.some(l => filterLabels.includes(l))) return true

    return false
}

// Drag & Drop handling
async function onDragChange(event: {
    added?: { element: Ticket; newIndex: number }
    removed?: { element: Ticket; oldIndex: number }
    moved?: { element: Ticket; oldIndex: number; newIndex: number }
}) {
    if (event.added) {
        // Ticket moved INTO this column
        const { element, newIndex } = event.added
        const updates = localTickets.value.map((t, i) => ({
            id: t.id,
            columnId: props.column.id,
            order: i,
        }))
        await board.moveTickets(updates)
    } else if (event.moved) {
        // Reordered within this column
        const updates = localTickets.value.map((t, i) => ({
            id: t.id,
            columnId: props.column.id,
            order: i,
        }))
        await board.moveTickets(updates)
    }
}
</script>

<style scoped>
.column-wrap {
    flex-shrink: 0;
    width: 300px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.column {
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.column:hover {
    border-color: var(--border-hover);
}

/* Accent stripe at top */
.column-accent {
    height: 3px;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    flex-shrink: 0;
}

.column-header {
    padding: 0.875rem 0.875rem 0.625rem;
    flex-shrink: 0;
}

.column-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.column-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

.column-count {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: var(--radius-full);
    background: var(--surface-elevated);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    min-width: 22px;
    text-align: center;
}

.column-actions {
    display: flex;
    gap: 4px;
}

.col-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 1rem;
    transition: background var(--transition-fast), color var(--transition-fast);
}

.col-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

/* Ticket list area */
.column-tickets {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 0;
    max-height: 100%;
}

.column-tickets--empty {
    align-items: center;
    justify-content: center;
}

/* Add button */
.column-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: calc(100% - 1.25rem);
    margin: 0.5rem 0.625rem 0.75rem;
    padding: 0.5rem;
    border: 1px dashed var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
}

.column-add-btn:hover {
    border-color: var(--accent);
    color: var(--text-accent);
    background: rgba(99, 102, 241, 0.06);
}

.add-first-btn {
    margin-top: 0.5rem;
    padding: 0.375rem 0.875rem;
    border: 1px dashed var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.add-first-btn:hover {
    border-color: var(--accent);
    color: var(--text-accent);
}
</style>
