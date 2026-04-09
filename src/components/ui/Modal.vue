<template>
    <Teleport to="body">
        <Transition name="backdrop">
            <div v-if="modelValue" class="modal-backdrop" @click.self="onBackdropClick">
                <Transition name="modal">
                    <div v-if="modelValue" :class="['modal-box', `modal-box--${size}`]" role="dialog" aria-modal="true">
                        <!-- Header -->
                        <div v-if="title || $slots.header" class="modal-header">
                            <slot name="header">
                                <h2 class="modal-title">{{ title }}</h2>
                            </slot>
                            <button class="modal-close" @click="$emit('update:modelValue', false)"
                                aria-label="Schließen">
                                ✕
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="modal-body">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer" class="modal-footer">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        title?: string
        size?: 'sm' | 'md' | 'lg' | 'xl'
        closeOnBackdrop?: boolean
    }>(),
    { size: 'md', closeOnBackdrop: true },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function onBackdropClick() {
    if (props.closeOnBackdrop) emit('update:modelValue', false)
}

// Keyboard
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.modelValue) emit('update:modelValue', false)
}

// Scroll lock
watch(() => props.modelValue, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
}

.modal-box {
    position: relative;
    background: var(--surface-modal);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid var(--border-hover);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 2rem);
    overflow: hidden;
    width: 100%;
}

.modal-box--sm {
    max-width: 400px;
}

.modal-box--md {
    max-width: 560px;
}

.modal-box--lg {
    max-width: 720px;
}

.modal-box--xl {
    max-width: 920px;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.modal-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
}

.modal-close:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    flex-shrink: 0;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

.modal-enter-active {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active {
    animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}
</style>
