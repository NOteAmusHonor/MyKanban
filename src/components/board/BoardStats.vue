<template>
    <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
        title="📊 Board Statistiken" size="md">
        <div class="stats-body">
            <!-- Total -->
            <div class="stat-hero">
                <span class="stat-hero-num">{{ board.stats.total }}</span>
                <span class="stat-hero-label">Tickets gesamt</span>
            </div>

            <div class="divider" />

            <!-- By Column -->
            <section class="stat-section">
                <h3 class="stat-section-title">Nach Spalte</h3>
                <div class="stat-list">
                    <div v-for="col in board.sortedColumns" :key="col.id" class="stat-row">
                        <div class="stat-row-header">
                            <span class="stat-dot" :style="{ background: col.color }" />
                            <span class="stat-label">{{ col.title }}</span>
                            <span class="stat-value">{{ board.stats.byColumn[col.id] ?? 0 }}</span>
                        </div>
                        <div class="stat-bar-wrap">
                            <div class="stat-bar-fill" :style="{
                                background: col.color,
                                width: percentOf(board.stats.byColumn[col.id] ?? 0, board.stats.total),
                            }" />
                        </div>
                    </div>
                </div>
            </section>

            <div class="divider" />

            <!-- By Priority -->
            <section class="stat-section">
                <h3 class="stat-section-title">Nach Priorität</h3>
                <div class="stat-list">
                    <div v-for="p in priorityList" :key="p.value" class="stat-row">
                        <div class="stat-row-header">
                            <span class="stat-dot" :style="{ background: p.color }" />
                            <span class="stat-label">{{ p.label }}</span>
                            <span class="stat-value">{{ board.stats.byPriority[p.value] ?? 0 }}</span>
                        </div>
                        <div class="stat-bar-wrap">
                            <div class="stat-bar-fill" :style="{
                                background: p.color,
                                width: percentOf(board.stats.byPriority[p.value] ?? 0, board.stats.total),
                            }" />
                        </div>
                    </div>
                </div>
            </section>

            <div class="divider" />

            <!-- Labels cloud -->
            <section v-if="board.allLabels.length" class="stat-section">
                <h3 class="stat-section-title">Labels</h3>
                <div class="labels-cloud">
                    <span v-for="label in board.allLabels" :key="label" class="tag">{{ label }}</span>
                </div>
            </section>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import type { Priority } from '@/types'
import { useBoardStore } from '@/stores/board'
import { priorityColor, priorityLabel } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()

const priorityList: { value: Priority; label: string; color: string }[] = [
    { value: 'urgent', label: 'Dringend', color: '#ef4444' },
    { value: 'high', label: 'Hoch', color: '#f97316' },
    { value: 'medium', label: 'Mittel', color: '#3b82f6' },
    { value: 'low', label: 'Niedrig', color: '#22c55e' },
]

function percentOf(n: number, total: number): string {
    if (!total) return '0%'
    return `${Math.round((n / total) * 100)}%`
}
</script>

<style scoped>
.stats-body {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.stat-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 0;
    gap: 0.25rem;
}

.stat-hero-num {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
}

.stat-hero-label {
    font-size: 0.8125rem;
    color: var(--text-secondary);
}

.stat-section {
    padding: 1rem 0;
}

.stat-section-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.875rem;
}

.stat-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.stat-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stat-row-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.stat-label {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.stat-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

.labels-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
</style>
