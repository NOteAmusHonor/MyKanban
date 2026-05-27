<template>
    <div class="column-wrap">
        <div class="column">
            <!-- Column Header (drag handle) -->
            <div class="column-header">
                <div class="column-title-row">
                    <span class="column-dot" :style="{ background: column.color }" />
                    <span class="column-title">{{ column.title }}</span>
                    <div class="column-actions">
                        <button class="col-btn" @click.stop="ui.openTicketCreate(column.id)"
                            data-tooltip="Ticket hinzufügen" aria-label="Ticket hinzufügen">
                            <Icon name="plus" :size="15" />
                        </button>
                        <button class="col-btn" @click.stop="ui.openColumnEdit(column)" data-tooltip="Spalte bearbeiten"
                            aria-label="Spalte bearbeiten">
                            <Icon name="more" :size="16" />
                        </button>
                    </div>
                    <span class="column-count">{{ columnTickets.length }}</span>
                </div>
            </div>

            <!-- Ticket List -->
            <draggable :list="localTickets" item-key="id" group="tickets" :animation="220" ghost-class="ticket-ghost"
                drag-class="ticket-drag" class="column-tickets"
                :class="{ 'column-tickets--empty': !columnTickets.length }" @change="onDragChange">
                <template #item="{ element }">
                    <KanbanTicket :key="element.id" :ticket="element" :is-filtered="isTicketFiltered(element)" />
                </template>
                <template #footer>
                    <div v-if="!columnTickets.length" class="empty-state">
                        <div class="empty-icon-wrap">
                            <Icon name="squircle" :size="20" />
                        </div>
                        <span>Noch keine Tickets</span>
                        <button class="add-first-btn" @click="ui.openTicketCreate(column.id)">
                            <Icon name="plus" :size="12" />
                            Ticket hinzufügen
                        </button>
                    </div>
                </template>
            </draggable>

            <!-- Footer add -->
            <button class="column-add-btn" @click="ui.openTicketCreate(column.id)">
                <Icon name="plus" :size="13" />
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
import Icon from '@/components/ui/Icon.vue'

const props = defineProps<{ column: Column }>()

const board = useBoardStore()
const ui = useUiStore()

const localTickets = ref<Ticket[]>([])

const columnTickets = computed(() =>
    board.tickets
        .filter(t => t.columnId === props.column.id)
        .sort((a, b) => a.order - b.order),
)

watch(columnTickets, (val) => {
    localTickets.value = [...val]
}, { immediate: true })

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

async function onDragChange(event: {
    added?: { element: Ticket; newIndex: number }
    removed?: { element: Ticket; oldIndex: number }
    moved?: { element: Ticket; oldIndex: number; newIndex: number }
}) {
    if (event.added || event.moved) {
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
    width: 296px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.column {
    background: var(--column-glass-bg);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid var(--column-glass-border);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: visible;
    box-shadow: var(--column-glass-shadow);
    transition: box-shadow var(--transition-base), border-color var(--transition-fast);
}

.column:hover {
    border-color: var(--border-hover);
}

/* Header (acts as drag handle) */
.column-header {
    padding: 0.875rem 0.875rem 0.5rem;
    flex-shrink: 0;
    cursor: grab;
    user-select: none;
    background: transparent;
}

.column-header:active {
    cursor: grabbing;
}

.column-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.column-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.column-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.012em;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.column-count {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: var(--radius-full);
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-tertiary);
    min-width: 20px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
}

.column-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity var(--transition-fast);
}

.column:hover .column-actions {
    opacity: 1;
}

.col-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    padding: 0;
}

.col-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.col-btn:active {
    transform: scale(0.92);
}

/* Ticket list */
.column-tickets {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.25rem 0.625rem 0.5rem;
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

/* Footer add button */
.column-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: calc(100% - 1.25rem);
    margin: 0.25rem 0.625rem 0.625rem;
    padding: 0.5rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-tertiary);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
    font-family: inherit;
}

.column-add-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.column-add-btn:active {
    transform: scale(0.98);
}

/* Empty state */
.empty-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--surface-elevated);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
}

.add-first-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 0.5rem;
    padding: 0.375rem 0.875rem;
    border: none;
    border-radius: var(--radius-full);
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
}

.add-first-btn:hover {
    background: var(--accent);
    color: #fff;
}

.add-first-btn:active {
    transform: scale(0.96);
}
</style>
