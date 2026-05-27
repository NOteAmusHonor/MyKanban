<template>
    <Teleport to="body">
        <Transition name="backdrop">
            <div v-if="modelValue" class="modal-backdrop" @click.self="onBackdropClick">
                <Transition name="modal" appear>
                    <div v-if="modelValue" :class="['modal-box', `modal-box--${size}`]"
                        role="dialog" aria-modal="true">
                        <!-- Header -->
                        <div v-if="title || $slots.header" class="modal-header">
                            <slot name="header">
                                <h2 class="modal-title">{{ title }}</h2>
                            </slot>
                            <button class="modal-close" @click="$emit('update:modelValue', false)"
                                aria-label="Schließen">
                                <Icon name="close" :size="12" :stroke-width="2.4" />
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
import Icon from '@/components/ui/Icon.vue'

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

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.modelValue) emit('update:modelValue', false)
}

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
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
}

html.light .modal-backdrop {
    background: rgba(0, 0, 0, 0.18);
}

.modal-box {
    position: relative;
    background: var(--surface-modal);
    -webkit-backdrop-filter: blur(60px) saturate(200%);
    backdrop-filter: blur(60px) saturate(200%);
    border: 0.5px solid var(--border-hover);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 2rem);
    overflow: hidden;
    width: 100%;
}

.modal-box--sm { max-width: 420px; }
.modal-box--md { max-width: 560px; }
.modal-box--lg { max-width: 720px; }
.modal-box--xl { max-width: 920px; }

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.125rem 1.375rem;
    border-bottom: 1px solid var(--separator);
    flex-shrink: 0;
}

.modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.018em;
    margin: 0;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: var(--surface-elevated);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
    padding: 0;
}

.modal-close:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
}

.modal-close:active {
    transform: scale(0.92);
}

.modal-body {
    padding: 1.375rem;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    padding: 0.875rem 1.375rem;
    border-top: 1px solid var(--separator);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.625rem;
    flex-shrink: 0;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.22s var(--ease-smooth);
}
.backdrop-enter-from,
.backdrop-leave-to { opacity: 0; }

.modal-enter-active {
    animation: slideUp 0.34s var(--ease-spring);
}
.modal-leave-active {
    animation: slideUp 0.22s var(--ease-spring) reverse;
}
</style>
