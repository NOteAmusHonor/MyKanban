<template>
    <article
        :class="['ticket-card', `ticket-card--${ticket.priority}`, { 'ticket-card--filtered': isFiltered }]"
        @click="ui.openTicketEdit(ticket)"
        role="button"
        tabindex="0"
        @keydown.enter="ui.openTicketEdit(ticket)">

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
            <span v-for="label in ticket.labels.slice(0, 4)" :key="label" class="tag">{{ label }}</span>
            <span v-if="ticket.labels.length > 4" class="tag tag--muted">+{{ ticket.labels.length - 4 }}</span>
        </div>

        <!-- Footer -->
        <div class="ticket-footer">
            <span class="ticket-date">{{ formatDateRelative(ticket.createdAt) }}</span>
            <span v-if="ticket.description.trim()" class="ticket-meta" title="Hat Beschreibung">
                <Icon name="edit" :size="11" />
            </span>
        </div>
    </article>
</template>

<script setup lang="ts">
import type { Ticket } from '@/types'
import { formatTicketId, formatDateRelative } from '@/utils/helpers'
import { useUiStore } from '@/stores/ui'
import Badge from '@/components/ui/Badge.vue'
import Icon from '@/components/ui/Icon.vue'

defineProps<{ ticket: Ticket; isFiltered?: boolean }>()
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
        .slice(0, 120)
}
</script>

<style scoped>
.ticket-card {
    position: relative;
    flex-shrink: 0;
    background: var(--bg-canvas);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.75rem 0.875rem;
    cursor: pointer;
    overflow: hidden;
    transition:
        background var(--transition-fast),
        border-color var(--transition-fast),
        transform var(--transition-base),
        box-shadow var(--transition-base);
    user-select: none;
    box-shadow: var(--shadow-xs);
}

html.light .ticket-card {
    background: #ffffff;
}

.ticket-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--priority-color, var(--accent));
    opacity: 0.85;
    transition: opacity var(--transition-fast);
}

.ticket-card--urgent { --priority-color: var(--priority-urgent); }
.ticket-card--high   { --priority-color: var(--priority-high); }
.ticket-card--medium { --priority-color: var(--priority-medium); }
.ticket-card--low    { --priority-color: var(--priority-low); }

.ticket-card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

.ticket-card:active {
    transform: translateY(0) scale(0.99);
    transition-duration: 0.08s;
}

.ticket-card:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
    border-color: var(--accent);
}

.ticket-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.375rem;
}

.ticket-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.32;
    letter-spacing: -0.012em;
    margin: 0 0 0.375rem 0;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.45;
    margin: 0 0 0.5rem 0;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 0.5rem;
}

.tag--muted {
    color: var(--text-tertiary);
    background: var(--surface);
}

.ticket-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.125rem;
}

.ticket-date {
    font-size: 0.6875rem;
    color: var(--text-tertiary);
    font-weight: 500;
}

.ticket-meta {
    display: inline-flex;
    align-items: center;
    color: var(--text-muted);
}

.ticket-card--filtered {
    opacity: 0.28;
    pointer-events: none;
    transform: scale(0.985);
}
</style>
