<template>
  <transition name="overlay">
    <div v-if="isOpen" class="cart-overlay" @click="$emit('close')"></div>
  </transition>
  
  <transition name="slide">
    <div v-if="isOpen" class="cart-panel">
      <div class="cart-header">
        <h2>{{ t('cart.title') }}</h2>
        <button @click="$emit('close')" class="close-btn" :aria-label="t('cart.close')">
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
      
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="empty-icon"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>{{ t('cart.empty') }}</p>
        </div>
        
        <div v-else class="cart-items">
          <CartItem 
            v-for="item in cartItems" 
            :key="item.id" 
            :item="item" 
            @remove="$emit('remove-item', item.id)"
          />
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="total">
          <span class="total-label">{{ t('cart.total') }}:</span>
          <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '../types/cart'
import CartItem from './CartItem.vue'
import { useI18n } from '../i18n'

interface Props {
  isOpen: boolean
  cartItems: CartItemType[]
  totalPrice: number
}

defineProps<Props>()

defineEmits<{
  close: []
  'remove-item': [id: number]
}>()

const { t } = useI18n()
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.cart-header h2 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}

.close-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart p {
  font-size: 1.1rem;
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
  }
  
  .cart-header {
    padding: 1rem;
  }
  
  .cart-content {
    padding: 0.75rem;
  }
  
  .cart-footer {
    padding: 1rem;
  }
}
</style>
