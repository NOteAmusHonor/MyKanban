<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="t in uiStore.toasts" :key="t.id"
                    :class="['toast', `toast--${t.type}`, { 'toast--leaving': t.leaving }]"
                    @click="uiStore.removeToast(t.id)">
                    <span class="toast__icon">{{ icons[t.type] }}</span>
                    <span class="toast__msg">{{ t.message }}</span>
                    <div class="toast__progress">
                        <div class="toast__progress-bar" :style="{ animationDuration: `${t.duration ?? 3500}ms` }" />
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
const uiStore = useUiStore()

const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
}
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
}

.toast {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    min-width: 260px;
    max-width: 380px;
    border-radius: var(--radius-lg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid;
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    pointer-events: all;
    position: relative;
    overflow: hidden;
    font-size: 0.875rem;
    font-weight: 500;
}

.toast__icon {
    font-size: 0.875rem;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 700;
}

.toast__msg {
    flex: 1;
    line-height: 1.4;
}

.toast--success {
    background: rgba(34, 197, 94, 0.14);
    border-color: rgba(34, 197, 94, 0.35);
    color: #22c55e;
}

.toast--success .toast__icon {
    background: rgba(34, 197, 94, 0.2);
}

.toast--error {
    background: rgba(239, 68, 68, 0.14);
    border-color: rgba(239, 68, 68, 0.35);
    color: #ef4444;
}

.toast--error .toast__icon {
    background: rgba(239, 68, 68, 0.2);
}

.toast--info {
    background: rgba(99, 102, 241, 0.14);
    border-color: rgba(99, 102, 241, 0.35);
    color: var(--text-accent);
}

.toast--info .toast__icon {
    background: rgba(99, 102, 241, 0.2);
}

.toast--warning {
    background: rgba(249, 115, 22, 0.14);
    border-color: rgba(249, 115, 22, 0.35);
    color: #f97316;
}

.toast--warning .toast__icon {
    background: rgba(249, 115, 22, 0.2);
}

/* Progress bar */
.toast__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
}

.toast__progress-bar {
    height: 100%;
    background: currentColor;
    opacity: 0.6;
    animation: toast-progress linear forwards;
    transform-origin: left;
}

@keyframes toast-progress {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

/* TransitionGroup */
.toast-enter-active {
    animation: toastIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
    animation: toastOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.toast-move {
    transition: transform 0.3s ease;
}
</style>
