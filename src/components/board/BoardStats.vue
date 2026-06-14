<template>
    <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
        title="Statistiken" size="lg">
        <div class="stats-body">
            <!-- Header Hero -->
            <div class="stat-hero">
                <span class="stat-hero-num">{{ board.stats.total }}</span>
                <span class="stat-hero-label">Tickets gesamt</span>
            </div>

            <div class="stats-grid">
                <!-- Donut Chart: Priorities -->
                <section class="stat-card stat-card--chart">
                    <h3 class="stat-card-title">Prioritäten</h3>
                    <div class="donut-wrap">
                        <svg viewBox="0 0 100 100" class="donut">
                            <circle v-for="(p, idx) in priorityData" :key="p.value"
                                :cx="50" :cy="50" r="40"
                                :stroke="p.color"
                                stroke-width="12"
                                fill="none"
                                :style="{
                                    strokeDasharray: `${p.dash} ${circumference}`,
                                    strokeDashoffset: p.offset,
                                    animationDelay: `${idx * 100}ms`
                                }"
                                class="donut-segment"
                            />
                        </svg>
                        <div class="donut-center">
                            <span class="donut-total">{{ board.stats.total }}</span>
                            <span class="donut-label">Tickets</span>
                        </div>
                    </div>
                    <div class="legend">
                        <div v-for="p in priorityList" :key="p.value" class="legend-item">
                            <span class="legend-dot" :style="{ background: p.color }" />
                            <span class="legend-text">{{ p.label }}</span>
                            <span class="legend-val">{{ board.stats.byPriority[p.value] ?? 0 }}</span>
                        </div>
                    </div>
                </section>

                <!-- Bar Chart: Columns -->
                <section class="stat-card stat-card--bars">
                    <h3 class="stat-card-title">Spaltenverteilung</h3>
                    <div class="bar-chart">
                        <div v-for="col in board.sortedColumns" :key="col.id" class="bar-row">
                            <div class="bar-info">
                                <span class="bar-label">{{ col.title }}</span>
                                <span class="bar-count">{{ board.stats.byColumn[col.id] ?? 0 }}</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill" :style="{
                                    width: percentOf(board.stats.byColumn[col.id] ?? 0, board.stats.total),
                                    background: `linear-gradient(90deg, ${col.color} 0%, ${col.color}cc 100%)`
                                }" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Labels -->
            <section v-if="board.allLabels.length" class="stat-card stat-card--labels">
                <h3 class="stat-card-title">Labels</h3>
                <div class="labels-cloud">
                    <span v-for="label in board.allLabels" :key="label" class="tag">
                        {{ label }}
                        <span class="tag-count">{{ getLabelCount(label) }}</span>
                    </span>
                </div>
            </section>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Priority } from '@/types'
import { useBoardStore } from '@/stores/board'
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()

const priorityList: { value: Priority; label: string; color: string }[] = [
    { value: 'urgent', label: 'Dringend', color: 'var(--priority-urgent)' },
    { value: 'high',   label: 'Hoch',     color: 'var(--priority-high)' },
    { value: 'medium', label: 'Mittel',   color: 'var(--priority-medium)' },
    { value: 'low',    label: 'Niedrig',  color: 'var(--priority-low)' },
]

const circumference = 2 * Math.PI * 40 // r=40

const priorityData = computed(() => {
    const total = board.stats.total || 1
    let cumulativeOffset = 0
    return priorityList.map(p => {
        const count = board.stats.byPriority[p.value] ?? 0
        const pct = count / total
        const dash = pct * circumference
        const offset = -cumulativeOffset
        cumulativeOffset += dash
        return { ...p, count, dash, offset, pct }
    }).filter(p => p.count > 0)
})

function percentOf(n: number, total: number): string {
    if (!total) return '0%'
    return `${Math.round((n / total) * 100)}%`
}

function getLabelCount(label: string): number {
    return board.tickets.filter(t => t.labels.includes(label)).length
}
</script>

<style scoped>
.stats-body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stat-hero {
    text-align: center;
    padding: 1rem 0;
}

.stat-hero-num {
    display: block;
    font-size: 4.5rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover, var(--accent)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.stat-hero-label {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-tertiary);
    letter-spacing: 0.01em;
    text-transform: uppercase;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    background: var(--surface);
    border: 1px solid var(--separator);
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
}

.stat-card-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-tertiary);
    margin: 0 0 1rem 0;
    letter-spacing: -0.005em;
    text-transform: uppercase;
}

/* Donut Chart */
.donut-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    max-width: 180px;
    margin: 0 auto 1rem;
}

.donut {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.donut-segment {
    transition: stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

.donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.donut-total {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
}

.donut-label {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.25rem;
}

.legend {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
}

.legend-text {
    flex: 1;
    color: var(--text-secondary);
}

.legend-val {
    font-weight: 600;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

/* Bar Chart */
.bar-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.bar-row {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.bar-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
}

.bar-label {
    color: var(--text-secondary);
}

.bar-count {
    font-weight: 600;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

.bar-track {
    height: 8px;
    background: var(--input-bg);
    border-radius: 999px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    width: 0;
}

@keyframes growBar {
    to { width: var(--target-width, inherit); }
}

/* Labels */
.labels-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--input-bg);
    border: 1px solid var(--separator);
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.tag-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 0.375rem;
    background: var(--surface-elevated);
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--text-primary);
}
</style>
