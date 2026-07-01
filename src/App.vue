<template>
  <RouterView />
  <Toast />
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import { useKeyboard } from '@/composables/useKeyboard'

useKeyboard()
</script>

<style>
/* Apple-inspired design system */
@import '@/assets/main.css';
</style>

<style scoped></style>
