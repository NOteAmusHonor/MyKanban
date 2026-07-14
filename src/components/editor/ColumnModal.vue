<template>
    <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
        :title="isEdit ? 'Spalte bearbeiten' : 'Neue Spalte'" size="sm">
        <form class="col-form" @submit.prevent="save">
            <!-- Name -->
            <div class="form-group">
                <label class="form-label">Name *</label>
                <input ref="nameInput" v-model="form.title" class="form-input" placeholder="z.B. In Bearbeitung"
                    required maxlength="60" />
            </div>

            <!-- Color Picker -->
            <div class="form-group">
                <label class="form-label">Farbe</label>
                <div class="color-grid">
                    <button v-for="color in presetColors" :key="color" type="button" class="color-swatch"
                        :class="{ active: form.color === color }" :style="{ background: color }"
                        @click="form.color = color" />
                </div>
                <div class="custom-color-row">
                    <label class="form-label" style="margin-bottom:0">Eigene Farbe</label>
                    <input type="color" v-model="form.color" class="color-input-native" />
                    <span class="color-hex">{{ form.color }}</span>
                </div>
                <!-- Preview -->
                <div class="color-preview" :style="{ background: form.color }" />
            </div>

            <!-- WIP Limit -->
            <div class="form-group">
                <label class="form-label">
                    WIP-Limit (optional)
                    <span class="form-hint">Maximale Tickets gleichzeitig in dieser Spalte (0 = kein Limit)</span>
                </label>
                <input type="number" v-model.number="form.wipLimit" class="form-input" min="0" max="999" placeholder="z.B. 3" />
            </div>
        </form>

        <template #footer>
            <div class="footer-left">
                <button v-if="isEdit" type="button" class="btn btn--danger" @click="deleteColumn" :disabled="deleting">
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
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import { stringToColor } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()
const ui = useUiStore()

const isEdit = computed(() => ui.columnModalData?.mode === 'edit')

const form = ref({ title: '', color: '#0a84ff', wipLimit: 0 })
const saving = ref(false)
const deleting = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

watch(() => ui.columnModalData, (d) => {
    if (!d) return
    if (d.mode === 'edit' && d.column) {
        form.value = { title: d.column.title, color: d.column.color, wipLimit: d.column.wipLimit ?? 0 }
    } else {
        form.value = { title: '', color: '#0a84ff', wipLimit: 0 }
    }
}, { immediate: true })

onMounted(() => nextTick(() => nameInput.value?.focus()))

// Auto color from title
watch(() => form.value.title, (t) => {
    if (isEdit.value) return
    if (t.trim()) form.value.color = stringToColor(t)
})

// Apple system colors palette
const presetColors = [
    '#ff3b30', '#ff9500', '#ffcc00', '#34c759',
    '#30d158', '#00c7be', '#32ade6', '#0a84ff',
    '#5e5ce6', '#bf5af2', '#ff2d55', '#a2845e',
    '#8e8e93', '#636366', '#48484a', '#1c1c1e',
]

async function save() {
    if (!form.value.title.trim()) return
    saving.value = true
    try {
        // 0 is the explicit value for an unlimited column and must be sent
        // to the API so an existing WIP limit is actually overwritten.
        const wip = form.value.wipLimit > 0 ? form.value.wipLimit : 0
        if (isEdit.value && ui.columnModalData?.column) {
            await board.updateColumn(ui.columnModalData.column.id, {
                title: form.value.title.trim(),
                color: form.value.color,
                wipLimit: wip,
            })
        } else {
            await board.createColumn({ title: form.value.title.trim(), color: form.value.color, wipLimit: wip })
        }
        ui.closeModal()
    } finally {
        saving.value = false
    }
}

async function deleteColumn() {
    if (!ui.columnModalData?.column) return
    if (!window.confirm(`Spalte „${ui.columnModalData.column.title}" und alle Tickets darin löschen?`)) return
    deleting.value = true
    await board.deleteColumn(ui.columnModalData.column.id)
    ui.closeModal()
    deleting.value = false
}
</script>

<style scoped>
.col-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: -0.005em;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.form-hint {
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--text-tertiary);
    letter-spacing: 0;
}

.form-input {
    width: 100%;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
}

.color-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.18);
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch.active {
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--surface-elevated), 0 0 0 4px var(--accent);
}

.custom-color-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--surface);
    border-radius: var(--radius-md);
}

.custom-color-row .form-label {
    flex: 1;
}

.color-input-native {
    width: 40px;
    height: 28px;
    padding: 0;
    border: 1px solid var(--separator);
    border-radius: var(--radius-sm);
    cursor: pointer;
    background: none;
}

.color-hex {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    text-transform: uppercase;
}

.color-preview {
    height: 6px;
    border-radius: var(--radius-full);
    transition: background var(--transition-base);
}

/* Footer */
:deep(.modal-footer) {
    display: flex !important;
    align-items: center !important;
}

.footer-left { flex: 1; }
.footer-right {
    display: flex;
    gap: 0.5rem;
}

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
