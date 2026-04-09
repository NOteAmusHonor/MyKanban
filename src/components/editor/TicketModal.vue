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
                            {{ p.icon }} {{ p.label }}
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
                            ✏️ Bearbeiten
                        </button>
                        <button type="button" :class="['tab', { active: descTab === 'preview' }]"
                            @click="descTab = 'preview'">
                            👁 Vorschau
                        </button>
                    </div>
                </div>

                <textarea v-if="descTab === 'edit'" v-model="form.description" class="form-input desc-textarea"
                    placeholder="Markdown wird unterstützt…

# Überschrift
**Fett**, *kursiv*, `Code`

- Listenpunkt 1
- Listenpunkt 2" />
                <div v-else class="markdown-preview desc-preview glass" v-html="renderedDescription" />
            </div>

            <!-- Labels -->
            <div class="form-group">
                <label class="form-label">Labels</label>
                <div class="labels-input-wrap glass">
                    <span v-for="label in form.labels" :key="label" class="tag">
                        {{ label }}
                        <button type="button" class="tag-remove" @click="removeLabel(label)">✕</button>
                    </span>
                    <input v-model="labelInput" class="labels-input" placeholder="Label eingeben + Enter"
                        @keydown.enter.prevent="addLabel" @keydown.,.prevent="addLabel" />
                </div>
                <p class="form-hint">Enter oder Komma zum Hinzufügen</p>
            </div>
        </form>

        <template #footer>
            <div class="footer-left">
                <button v-if="isEdit" type="button" class="btn btn--danger" @click="deleteTicket" :disabled="deleting">
                    🗑 Löschen
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
import { priorityColor, priorityBg } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'

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
const priorities: { value: Priority; label: string; icon: string; color: string; bg: string }[] = [
    { value: 'urgent', label: 'Dringend', icon: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { value: 'high', label: 'Hoch', icon: '🟠', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    { value: 'medium', label: 'Mittel', icon: '🔵', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { value: 'low', label: 'Niedrig', icon: '🟢', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
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
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.form-input {
    width: 100%;
}

.form-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
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
    gap: 5px;
    padding: 0.375rem 0.625rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
}

.priority-btn:hover {
    border-color: var(--p-color);
    color: var(--p-color);
}

.priority-btn.active {
    background: var(--p-bg);
    border-color: var(--p-color);
    color: var(--p-color);
    box-shadow: 0 0 8px color-mix(in srgb, var(--p-color) 30%, transparent);
}

/* Description */
.desc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.desc-tabs {
    display: flex;
    gap: 4px;
}

.tab {
    padding: 3px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
}

.tab.active {
    background: var(--surface-elevated);
    color: var(--text-primary);
    border-color: var(--border-hover);
}

.desc-textarea {
    min-height: 160px;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 0.875rem;
}

.desc-preview {
    min-height: 160px;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
}

/* Labels input */
.labels-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 0.5rem 0.625rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--input-border);
    min-height: 42px;
    align-items: center;
    cursor: text;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.labels-input-wrap:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--input-focus);
}

.labels-input {
    flex: 1;
    min-width: 120px;
    background: none;
    border: none;
    padding: 2px 4px;
    font-size: 0.875rem;
    color: var(--text-primary);
    outline: none;
    box-shadow: none !important;
}

.tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    font-size: 0.6875rem;
    padding: 0;
    margin-left: 3px;
    line-height: 1;
    display: flex;
    align-items: center;
}

.tag-remove:hover {
    opacity: 1;
}

/* Footer split */
:deep(.modal-footer) {
    display: flex !important;
    align-items: center !important;
}

.footer-left {
    flex: 1;
}

.footer-right {
    display: flex;
    gap: 0.625rem;
}

/* Button styles (scoped) */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
}

.btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.btn--primary {
    background: var(--accent-gradient);
    color: #fff;
    box-shadow: 0 2px 8px var(--accent-glow);
}

.btn--primary:not(:disabled):hover {
    filter: brightness(1.1);
}

.btn--ghost {
    background: transparent;
    color: var(--text-secondary);
}

.btn--ghost:hover {
    background: var(--surface);
    color: var(--text-primary);
}

.btn--danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
}

.btn--danger:hover {
    background: rgba(239, 68, 68, 0.2);
}
</style>
