<template>
    <span :class="['badge', `badge--${priority}`]">
        <span class="badge__dot" />
        {{ priorityLabel(priority) }}
    </span>
</template>

<script setup lang="ts">
import type { Priority } from '@/types'
import { priorityLabel } from '@/utils/helpers'

defineProps<{ priority: Priority }>()
</script>

<style scoped>
.badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 9px 2px 7px;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    white-space: nowrap;
    border: none;
}

.badge__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.badge--urgent {
    color: var(--priority-urgent);
    background: color-mix(in srgb, var(--priority-urgent) 14%, transparent);
}

.badge--urgent .badge__dot { background: var(--priority-urgent); }

.badge--high {
    color: var(--priority-high);
    background: color-mix(in srgb, var(--priority-high) 14%, transparent);
}

.badge--high .badge__dot { background: var(--priority-high); }

.badge--medium {
    color: var(--priority-medium);
    background: color-mix(in srgb, var(--priority-medium) 14%, transparent);
}

.badge--medium .badge__dot { background: var(--priority-medium); }

.badge--low {
    color: var(--priority-low);
    background: color-mix(in srgb, var(--priority-low) 14%, transparent);
}

.badge--low .badge__dot { background: var(--priority-low); }
</style>
