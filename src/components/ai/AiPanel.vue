<template>
    <!-- Placeholder: AI panel is not implemented yet. -->
    <div v-if="modelValue" class="ai-panel-placeholder" @click="$emit('update:modelValue', false)" />
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<style scoped>
.ai-panel-placeholder { display: none; }
</style>
