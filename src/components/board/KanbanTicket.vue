<template>
    <article :class="['ticket-card', `ticket-card--${ticket.priority}`, { 'ticket-card--filtered': isFiltered }]"
        @click="ui.openTicketEdit(ticket)" draggable="false" role="button" tabindex="0"
        @keydown.enter="ui.openTicketEdit(ticket)">
        <!-- Drag handle + priority accent bar -->
        <div class="ticket-accent" :style="{ background: priorityColor(ticket.priority) }" />

        <!-- Header row -->
        <div class="ticket-header">
            <span class="ticket-number">{{ formatTicketId(ticket.ticketNumber) }}</span>
            <Badge :priority="ticket.priority" />
        </div>

        <!-- Title -->
        <h3 class="ticket-title">{{ ticket.title }}</h3>

        <!-- Description preview -->
        <p v-if="ticket.description.trim()" class="ticket-desc">
            {{ stripMarkdown(ticket.description) }}
        </p>

        <!-- Labels -->
        <div v-if="ticket.labels.length" class="ticket-labels">
            <span v-for="label in ticket.labels" :key="label" class="tag">{{ label }}</span>
        </div>

        <!-- Footer -->
        <div class="ticket-footer">
            <span class="ticket-date">{{ formatDateRelative(ticket.createdAt) }}</span>
            <span v-if="ticket.description.trim()" class="ticket-has-desc" title="Hat Beschreibung">
                📝
            </span>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ticket } from '@/types'
import { formatTicketId, priorityColor, formatDateRelative } from '@/utils/helpers'
import { useUiStore } from '@/stores/ui'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{ ticket: Ticket; isFiltered?: boolean }>()
const ui = useUiStore()

function stripMarkdown(text: string): string {
    return text
        .replace(/#{1,6}\s*/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 100)
}
</script>

<style scoped>
.ticket-card {
    position: relative;
    flex-shrink: 0;
    background: var(--surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.875rem 0.875rem 0.75rem 1.125rem;
    cursor: pointer;
    overflow: hidden;
    transition:
        background var(--transition-fast),
        border-color var(--transition-fast),
        transform var(--transition-fast),
        box-shadow var(--transition-fast);
    user-select: none;
}

.ticket-card:hover {
    background: var(--surface-elevated);
    border-color: var(--border-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

.ticket-card:active {
    transform: translateY(0) scale(0.98);
}

.ticket-card:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* Priority accent bar on left */
.ticket-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
}

.ticket-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.ticket-title {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.4;
    margin-bottom: 0.375rem;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 0.5rem;
}

.ticket-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.ticket-date {
    font-size: 0.72rem;
    color: var(--text-muted);
}

.ticket-has-desc {
    font-size: 0.75rem;
    opacity: 0.6;
}

/* Filtered out */
.ticket-card--filtered {
    opacity: 0.3;
    pointer-events: none;
}
</style>
