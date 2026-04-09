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
    padding: 2px 10px 2px 7px;
    border-radius: var(--radius-full);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
    border: 1px solid;
}

.badge__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.badge--urgent {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.3);
}

.badge--urgent .badge__dot {
    background: #ef4444;
    box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
}

.badge--high {
    color: #f97316;
    background: rgba(249, 115, 22, 0.12);
    border-color: rgba(249, 115, 22, 0.3);
}

.badge--high .badge__dot {
    background: #f97316;
}

.badge--medium {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
}

.badge--medium .badge__dot {
    background: #3b82f6;
}

.badge--low {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.3);
}

.badge--low .badge__dot {
    background: #22c55e;
}
</style>
