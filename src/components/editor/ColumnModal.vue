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
        </form>

        <template #footer>
            <div class="footer-left">
                <button v-if="isEdit" type="button" class="btn btn--danger" @click="deleteColumn" :disabled="deleting">
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
import { useBoardStore } from '@/stores/board'
import { useUiStore } from '@/stores/ui'
import { stringToColor } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()

const board = useBoardStore()
const ui = useUiStore()

const isEdit = computed(() => ui.columnModalData?.mode === 'edit')

const form = ref({ title: '', color: '#6366f1' })
const saving = ref(false)
const deleting = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

watch(() => ui.columnModalData, (d) => {
    if (!d) return
    if (d.mode === 'edit' && d.column) {
        form.value = { title: d.column.title, color: d.column.color }
    } else {
        form.value = { title: '', color: '#6366f1' }
    }
}, { immediate: true })

onMounted(() => nextTick(() => nameInput.value?.focus()))

// Auto color from title
watch(() => form.value.title, (t) => {
    if (isEdit.value) return
    if (t.trim()) form.value.color = stringToColor(t)
})

const presetColors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#64748b', '#78716c',
]

async function save() {
    if (!form.value.title.trim()) return
    saving.value = true
    try {
        if (isEdit.value && ui.columnModalData?.column) {
            await board.updateColumn(ui.columnModalData.column.id, {
                title: form.value.title.trim(),
                color: form.value.color,
            })
        } else {
            await board.createColumn({ title: form.value.title.trim(), color: form.value.color })
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
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
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
    border-radius: var(--radius-sm);
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.color-swatch:hover {
    transform: scale(1.15);
}

.color-swatch.active {
    border-color: #fff;
    box-shadow: 0 0 0 2px var(--accent);
    transform: scale(1.15);
}

.custom-color-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
}

.color-input-native {
    width: 36px;
    height: 28px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    background: none;
}

.color-hex {
    font-family: 'SF Mono', monospace;
    font-size: 0.8125rem;
    color: var(--text-muted);
}

.color-preview {
    height: 4px;
    border-radius: var(--radius-full);
    transition: background var(--transition-base);
}

/* Footer */
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
