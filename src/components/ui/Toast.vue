<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="t in uiStore.toasts" :key="t.id"
                    :class="['toast', `toast--${t.type}`, { 'toast--leaving': t.leaving }]"
                    @click="uiStore.removeToast(t.id)" role="status">
                    <span :class="['toast__icon', `toast__icon--${t.type}`]">
                        <Icon :name="iconFor(t.type)" :size="12" :stroke-width="2.6" />
                    </span>
                    <span class="toast__msg">{{ t.message }}</span>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import Icon from '@/components/ui/Icon.vue'

const uiStore = useUiStore()

function iconFor(type: string) {
    switch (type) {
        case 'success': return 'check'
        case 'error':   return 'close'
        case 'warning': return 'alert'
        default:        return 'info'
    }
}
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
}

.toast {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem 0.625rem 0.625rem;
    min-width: 240px;
    max-width: 420px;
    border-radius: var(--radius-full);
    background: var(--material-thick);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    backdrop-filter: blur(40px) saturate(180%);
    border: 0.5px solid var(--border-hover);
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    pointer-events: all;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

.toast__icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
}

.toast__icon--success { background: var(--priority-low); }
.toast__icon--error   { background: var(--priority-urgent); }
.toast__icon--warning { background: var(--priority-high); }
.toast__icon--info    { background: var(--accent); }

.toast__msg {
    flex: 1;
    line-height: 1.35;
}

/* TransitionGroup */
.toast-enter-active {
    animation: toastIn 0.36s var(--ease-spring);
}

.toast-leave-active {
    animation: toastOut 0.28s var(--ease-smooth) forwards;
    position: absolute;
}

.toast-move {
    transition: transform 0.3s var(--ease-spring);
}
</style>
