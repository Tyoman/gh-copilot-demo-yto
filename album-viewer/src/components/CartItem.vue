<template>
  <div class="cart-item">
    <img :src="item.image_url" :alt="item.title" class="item-image" />
    <div class="item-details">
      <h4 class="item-title">{{ item.title }}</h4>
      <p class="item-artist">{{ item.artist }}</p>
      <p class="item-price">${{ item.price.toFixed(2) }}</p>
    </div>
    <button @click="$emit('remove')" class="remove-btn" :aria-label="t('cart.remove')">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '../types/cart'
import { useI18n } from '../i18n'

interface Props {
  item: CartItem
}

defineProps<Props>()

defineEmits<{
  remove: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-artist {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  margin: 0;
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffd700;
}

.remove-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba(255, 71, 87, 0.2);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(255, 71, 87, 0.4);
  transform: scale(1.1);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
  color: white;
}

@media (max-width: 768px) {
  .cart-item {
    padding: 0.75rem;
  }
  
  .item-image {
    width: 50px;
    height: 50px;
  }
}
</style>
