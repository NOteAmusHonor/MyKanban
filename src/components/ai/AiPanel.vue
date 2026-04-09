<template>
    <Teleport to="body">
        <div class="ai-backdrop" @click.self="$emit('update:modelValue', false)">
            <Transition name="slide-right">
                <div v-if="modelValue" class="ai-panel glass-elevated">
                    <!-- Header -->
                    <div class="ai-header">
                        <div class="ai-title">
                            <span class="ai-icon">🤖</span>
                            <span>KI-Aktivität</span>
                        </div>
                        <button class="ai-close" @click="$emit('update:modelValue', false)">✕</button>
                    </div>

                    <!-- Info Box -->
                    <div class="ai-info glass">
                        <h3 class="ai-info-title">🔗 KI-Integration</h3>
                        <p class="ai-info-text">
                            Die KI kann <code>kanban.json</code> direkt lesen und bearbeiten.
                            Das Board erkennt Änderungen sofort via WebSocket.
                        </p>

                        <div class="ai-info-example">
                            <span class="ai-info-label">Datei-Pfad</span>
                            <code class="ai-code">{{ kanbanPath }}</code>
                        </div>

                        <div class="ai-info-example">
                            <span class="ai-info-label">Schema</span>
                            <code class="ai-code">kanban.schema.json</code>
                        </div>

                        <div class="ai-prompt-section">
                            <span class="ai-info-label">Beispiel-Prompt für deine KI</span>
                            <div class="ai-prompt-box">
                                <pre class="ai-prompt-text">{{ examplePrompt }}</pre>
                                <button class="copy-btn" @click="copyPrompt">
                                    {{ copied ? '✓ Kopiert!' : '📋 Kopieren' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Event Feed -->
                    <div class="ai-events-header">
                        <span class="ai-events-title">Live-Feed</span>
                        <span class="ws-dot-small" :class="{ disconnected: !board.wsConnected }" />
                        <span class="ws-label-small">{{ board.wsConnected ? 'Verbunden' : 'Offline' }}</span>
                        <button v-if="ui.aiEvents.length" class="clear-events" @click="ui.aiEvents.length = 0">
                            Leeren
                        </button>
                    </div>

                    <div class="ai-events">
                        <TransitionGroup name="list">
                            <div v-for="event in ui.aiEvents" :key="event.timestamp + event.type" class="ai-event-item">
                                <span :class="['event-dot', `event-dot--${eventColor(event.type)}`]" />
                                <div class="event-content">
                                    <span class="event-desc">{{ event.description }}</span>
                                    <span class="event-time">{{ formatEventTime(event.timestamp) }}</span>
                                </div>
                            </div>
                        </TransitionGroup>

                        <div v-if="!ui.aiEvents.length" class="empty-state">
                            <span class="empty-icon">📡</span>
                            <span>Warte auf KI-Aktivität…</span>
                            <span style="font-size:0.75rem; color:var(--text-muted)">
                                Bearbeite kanban.json mit einer KI, um Ereignisse zu sehen.
                            </span>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WsEventType } from '@/types'
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()
const ui = useUiStore()

const kanbanPath = computed(() => 'kanban.json (im Projektordner)')
const copied = ref(false)

const examplePrompt = `Bitte analysiere die Datei kanban.json in diesem Projekt.
Erstelle 3 neue Tickets für folgende Aufgaben:
1. Login-Seite implementieren (Priorität: hoch, Spalte: Backlog)
2. API-Dokumentation schreiben (Priorität: mittel)
3. Unit-Tests für UserService (Priorität: hoch)

Beachte das Schema in kanban.schema.json.
Ticket-Nummern müssen zufällig zwischen 1000-9999 sein.`

function copyPrompt() {
    navigator.clipboard.writeText(examplePrompt).then(() => {
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    })
}

function eventColor(type: WsEventType): string {
    if (type.includes('created')) return 'green'
    if (type.includes('deleted')) return 'red'
    if (type.includes('updated') || type === 'board-updated') return 'blue'
    return 'gray'
}

function formatEventTime(ts: string): string {
    const d = new Date(ts)
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.ai-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
}

.ai-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-xl) 0 0 var(--radius-xl);
    border-right: none;
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.125rem 1.25rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.ai-title {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.ai-icon {
    font-size: 1.125rem;
}

.ai-close {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.ai-close:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

/* Info box */
.ai-info {
    margin: 1rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex-shrink: 0;
}

.ai-info-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.ai-info-text {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.5;
}

.ai-info-text code {
    font-family: 'SF Mono', monospace;
    font-size: 0.8125rem;
    background: var(--surface-elevated);
    padding: 1px 5px;
    border-radius: 4px;
    color: var(--text-accent);
}

.ai-info-example {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.ai-info-label {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    white-space: nowrap;
    min-width: 70px;
}

.ai-code {
    font-family: 'SF Mono', monospace;
    font-size: 0.8rem;
    background: var(--surface-elevated);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    color: var(--text-accent);
}

/* Prompt section */
.ai-prompt-section {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.ai-prompt-box {
    position: relative;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.75rem;
    padding-bottom: 2.5rem;
}

.ai-prompt-text {
    font-family: 'SF Mono', monospace;
    font-size: 0.72rem;
    color: var(--text-secondary);
    white-space: pre-wrap;
    line-height: 1.5;
    margin: 0;
}

.copy-btn {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    padding: 3px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-accent);
    font-size: 0.72rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.copy-btn:hover {
    background: var(--surface-elevated);
}

/* Events */
.ai-events-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem 0.375rem;
    flex-shrink: 0;
}

.ai-events-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
}

.ws-dot-small {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--priority-low);
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.ws-dot-small.disconnected {
    background: var(--priority-urgent);
    box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
}

.ws-label-small {
    font-size: 0.72rem;
    color: var(--text-muted);
}

.clear-events {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 0.72rem;
    text-decoration: underline;
}

.ai-events {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.ai-event-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    background: var(--surface);
    border: 1px solid var(--border);
    transition: background var(--transition-fast);
}

.ai-event-item:hover {
    background: var(--surface-elevated);
}

.event-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
}

.event-dot--green {
    background: #22c55e;
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
}

.event-dot--red {
    background: #ef4444;
}

.event-dot--blue {
    background: #3b82f6;
}

.event-dot--gray {
    background: var(--text-muted);
}

.event-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.event-desc {
    font-size: 0.8125rem;
    color: var(--text-primary);
    line-height: 1.4;
}

.event-time {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: 'SF Mono', monospace;
}

/* Transition */
.slide-right-enter-active {
    animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-leave-active {
    animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}
</style>
