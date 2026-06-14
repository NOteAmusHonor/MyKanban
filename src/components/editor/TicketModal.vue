<template>
    <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
        :title="isEdit ? `TK-${data?.ticket?.ticketNumber} bearbeiten` : 'Neues Ticket'" size="lg">
        <form class="ticket-form" @submit.prevent="save">
            <!-- Title -->
            <div class="form-group">
                <label class="form-label">Titel *</label>
                <input ref="titleInput" v-model="form.title" class="form-input" placeholder="Was muss erledigt werden?"
                    required maxlength="200" />
            </div>

            <!-- Priority + Column row -->
            <div class="form-row">
                <!-- Priority -->
                <div class="form-group form-group--half">
                    <label class="form-label">Priorität</label>
                    <div class="priority-picker">
                        <button v-for="p in priorities" :key="p.value" type="button"
                            :class="['priority-btn', { active: form.priority === p.value }]"
                            :style="{ '--p-color': p.color, '--p-bg': p.bg }" @click="form.priority = p.value">
                            <span class="p-dot" />
                            {{ p.label }}
                        </button>
                    </div>
                </div>

                <!-- Column selector -->
                <div class="form-group form-group--half">
                    <label class="form-label">Spalte</label>
                    <select v-model="form.columnId" class="form-input">
                        <option v-for="col in board.sortedColumns" :key="col.id" :value="col.id">
                            {{ col.title }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Description (Markdown) -->
            <div class="form-group">
                <div class="desc-header">
                    <label class="form-label">Beschreibung</label>
                    <div class="desc-tabs">
                        <button type="button" :class="['tab', { active: descTab === 'edit' }]"
                            @click="descTab = 'edit'">
                            <Icon name="edit" :size="12" /> Bearbeiten
                        </button>
                        <button type="button" :class="['tab', { active: descTab === 'preview' }]"
                            @click="descTab = 'preview'">
                            <Icon name="eye" :size="12" /> Vorschau
                        </button>
                    </div>
                </div>

                <textarea v-if="descTab === 'edit'" v-model="form.description" class="form-input desc-textarea"
                    placeholder="Markdown wird unterstützt…

# Überschrift
**Fett**, *kursiv*, `Code`

- Listenpunkt 1
- Listenpunkt 2" />
                <div v-else class="markdown-preview desc-preview" v-html="renderedDescription" />
            </div>

            <!-- Labels -->
            <div class="form-group">
                <label class="form-label">Labels</label>
                <div class="labels-input-wrap">
                    <span v-for="label in form.labels" :key="label" class="tag">
                        {{ label }}
                        <button type="button" class="tag-remove" @click="removeLabel(label)"
                            aria-label="Label entfernen">
                            <Icon name="close" :size="9" :stroke-width="2.6" />
                        </button>
                    </span>
                    <input v-model="labelInput" class="labels-input" placeholder="Label eingeben + Enter"
                        @keydown.enter.prevent="addLabel" @keydown.,.prevent="addLabel" />
                </div>
                <p class="form-hint">Enter oder Komma zum Hinzufügen</p>
            </div>
        </form>

        <template #footer>
            <div class="footer-left">
                <button v-if="isEdit" type="button" class="btn btn--danger" @click="deleteTicket"
                    :disabled="deleting">
                    <Icon name="trash" :size="14" />
                    Löschen
                </button>
            </div>
            <div class="footer-right">
                <button type="button" class="btn btn--ghost" @click="$emit('update:modelValue', false)">
                    Abbrechen
                </button>
                <button type="button" class="btn btn--primary" @click="save" :disabled="!form.title.trim() || saving">
                    {{ saving ? 'Speichere…' : isEdit ? 'Speichern' : 'Erstellen' }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { Priority } from '@/types'
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()
const ui = useUiStore()

const isEdit = computed(() => ui.ticketModalData?.mode === 'edit')
const data = computed(() => ui.ticketModalData)

// ─── Form State ──────────────────────────────────────────────────────────────
const form = ref({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    columnId: '',
    labels: [] as string[],
})

const descTab = ref<'edit' | 'preview'>('edit')
const labelInput = ref('')
const saving = ref(false)
const deleting = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

// Populate form from edit data
watch(data, (d) => {
    if (!d) return
    if (d.mode === 'edit' && d.ticket) {
        form.value = {
            title: d.ticket.title,
            description: d.ticket.description,
            priority: d.ticket.priority,
            columnId: d.ticket.columnId,
            labels: [...d.ticket.labels],
        }
        descTab.value = 'preview'
    } else {
        form.value = {
            title: '',
            description: '',
            priority: 'medium',
            columnId: d.columnId ?? board.sortedColumns[0]?.id ?? '',
            labels: [],
        }
        descTab.value = 'edit'
    }
}, { immediate: true })

onMounted(() => nextTick(() => titleInput.value?.focus()))

// ─── Markdown preview ─────────────────────────────────────────────────────────
const renderedDescription = computed(() => {
    if (!form.value.description.trim()) return '<p style="color:var(--text-muted)">Keine Beschreibung</p>'
    return DOMPurify.sanitize(marked.parse(form.value.description) as string)
})

// ─── Labels ───────────────────────────────────────────────────────────────────
function addLabel() {
    const val = labelInput.value.replace(',', '').trim()
    if (val && !form.value.labels.includes(val)) {
        form.value.labels.push(val)
    }
    labelInput.value = ''
}

function removeLabel(label: string) {
    form.value.labels = form.value.labels.filter(l => l !== label)
}

// ─── Save ─────────────────────────────────────────────────────────────────────
async function save() {
    if (!form.value.title.trim()) return
    saving.value = true
    try {
        if (isEdit.value && data.value?.ticket) {
            await board.updateTicket(data.value.ticket.id, {
                title: form.value.title.trim(),
                description: form.value.description,
                priority: form.value.priority,
                columnId: form.value.columnId,
                labels: form.value.labels,
            })
        } else {
            await board.createTicket({
                columnId: form.value.columnId,
                title: form.value.title.trim(),
                description: form.value.description,
                priority: form.value.priority,
                labels: form.value.labels,
            })
        }
        ui.closeModal()
    } finally {
        saving.value = false
    }
}

async function deleteTicket() {
    if (!data.value?.ticket) return
    deleting.value = true
    await board.deleteTicket(data.value.ticket.id)
    ui.closeModal()
    deleting.value = false
}

// ─── Priority options ─────────────────────────────────────────────────────────
const priorities: { value: Priority; label: string; color: string; bg: string }[] = [
    { value: 'urgent', label: 'Dringend', color: 'var(--priority-urgent)', bg: 'color-mix(in srgb, var(--priority-urgent) 14%, transparent)' },
    { value: 'high',   label: 'Hoch',     color: 'var(--priority-high)',   bg: 'color-mix(in srgb, var(--priority-high) 14%, transparent)' },
    { value: 'medium', label: 'Mittel',   color: 'var(--priority-medium)', bg: 'color-mix(in srgb, var(--priority-medium) 14%, transparent)' },
    { value: 'low',    label: 'Niedrig',  color: 'var(--priority-low)',    bg: 'color-mix(in srgb, var(--priority-low) 14%, transparent)' },
]
</script>

<style scoped>
.ticket-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: -0.005em;
}

.form-input {
    width: 100%;
}

.form-hint {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: -0.25rem;
}

/* Priority picker */
.priority-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

.priority-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
    letter-spacing: -0.005em;
}

.priority-btn .p-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--p-color);
    flex-shrink: 0;
    transition: transform var(--transition-fast);
}

.priority-btn:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.priority-btn:hover .p-dot {
    transform: scale(1.2);
}

.priority-btn.active {
    background: var(--p-bg);
    border-color: color-mix(in srgb, var(--p-color) 50%, transparent);
    color: var(--p-color);
}

.priority-btn.active .p-dot {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-color) 25%, transparent);
}

/* Description */
.desc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.desc-tabs {
    display: flex;
    gap: 2px;
    padding: 2px;
    background: var(--input-bg);
    border-radius: var(--radius-md);
}

.tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
}

.tab:hover {
    color: var(--text-primary);
}

.tab.active {
    background: var(--surface-elevated);
    color: var(--text-primary);
    box-shadow: var(--shadow-xs);
}

.desc-textarea {
    min-height: 180px;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.55;
}

.desc-preview {
    min-height: 180px;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    background: var(--surface);
    border: 1px solid var(--separator);
}

/* Labels input */
.labels-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 0.5rem 0.625rem;
    border-radius: var(--radius-md);
    background: var(--input-bg);
    border: 1px solid transparent;
    min-height: 44px;
    align-items: center;
    cursor: text;
    transition: all var(--transition-fast);
}

.labels-input-wrap:focus-within {
    background: var(--input-bg-focus);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-glow);
}

.labels-input {
    flex: 1;
    min-width: 120px;
    background: none;
    border: none;
    padding: 2px 4px;
    font-size: 0.8125rem;
    color: var(--text-primary);
    outline: none;
    box-shadow: none !important;
    width: auto;
}

.labels-input:focus,
.labels-input:hover { background: none; }

.tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-tertiary);
    padding: 1px;
    margin-left: 2px;
    line-height: 1;
    display: flex;
    align-items: center;
    border-radius: 50%;
    transition: all var(--transition-fast);
}

.tag-remove:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
}

/* Footer split */
:deep(.modal-footer) {
    display: flex !important;
    align-items: center !important;
}

.footer-left { flex: 1; }
.footer-right {
    display: flex;
    gap: 0.5rem;
}

/* Apple-style buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 1.125rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    letter-spacing: -0.005em;
    cursor: pointer;
    border: none;
    transition: all var(--transition-fast);
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn:not(:disabled):active {
    transform: scale(0.97);
}

.btn--primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.12);
}

.btn--primary:not(:disabled):hover {
    background: var(--accent-hover);
}

.btn--ghost {
    background: transparent;
    color: var(--text-secondary);
}

.btn--ghost:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
}

.btn--danger {
    background: color-mix(in srgb, var(--priority-urgent) 12%, transparent);
    color: var(--priority-urgent);
}

.btn--danger:not(:disabled):hover {
    background: var(--priority-urgent);
    color: #fff;
}
</style>
