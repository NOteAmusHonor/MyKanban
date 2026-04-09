<template>
    <button :class="['btn', `btn--${variant}`, { 'btn--loading': loading, 'btn--icon-only': iconOnly }]"
        :disabled="disabled || loading" v-bind="$attrs">
        <span v-if="loading" class="btn__spinner" />
        <span v-if="!iconOnly" class="btn__content">
            <slot />
        </span>
        <slot v-else />
    </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
        loading?: boolean
        disabled?: boolean
        iconOnly?: boolean
    }>(),
    { variant: 'secondary', loading: false, disabled: false, iconOnly: false },
)
</script>

<style scoped>
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
        background var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        opacity var(--transition-fast),
        transform var(--transition-fast);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    user-select: none;
}

.btn:not(:disabled):active {
    transform: scale(0.96);
}

.btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

/* Primary */
.btn--primary {
    background: var(--accent-gradient);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 2px 8px var(--accent-glow);
}

.btn--primary:not(:disabled):hover {
    box-shadow: 0 4px 16px var(--accent-glow);
    filter: brightness(1.1);
}

/* Accent (same as primary but more subtle) */
.btn--accent {
    background: rgba(99, 102, 241, 0.18);
    color: var(--text-accent);
    border-color: rgba(99, 102, 241, 0.3);
}

.btn--accent:not(:disabled):hover {
    background: rgba(99, 102, 241, 0.28);
    border-color: rgba(99, 102, 241, 0.5);
}

/* Secondary */
.btn--secondary {
    background: var(--surface-elevated);
    color: var(--text-primary);
    border-color: var(--border);
}

.btn--secondary:not(:disabled):hover {
    background: var(--surface-hover);
    border-color: var(--border-hover);
}

/* Ghost */
.btn--ghost {
    background: transparent;
    color: var(--text-secondary);
    border-color: transparent;
}

.btn--ghost:not(:disabled):hover {
    background: var(--surface);
    color: var(--text-primary);
}

/* Danger */
.btn--danger {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
}

.btn--danger:not(:disabled):hover {
    background: rgba(239, 68, 68, 0.22);
    border-color: rgba(239, 68, 68, 0.5);
}

/* Icon only */
.btn--icon-only {
    padding: 0.5rem;
    border-radius: var(--radius-md);
}

/* Loading spinner */
.btn--loading .btn__content {
    opacity: 0;
}

.btn__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
</style>
