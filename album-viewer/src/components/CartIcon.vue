<template>
  <button class="cart-icon" @click="$emit('click')" :aria-label="t('cart.title')">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="itemCount > 0" class="badge">
      {{ itemCount > 99 ? '99+' : itemCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  itemCount: number
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cart-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.cart-icon:active {
  transform: scale(0.95);
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(238, 90, 36, 0.4);
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
