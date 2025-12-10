<template>
  <Transition name="slide">
    <div v-if="isOpen" class="cart-panel-overlay" @click.self="$emit('close')">
      <div class="cart-panel">
        <div class="cart-header">
          <h2>🛒 {{ t('cart.title') }}</h2>
          <button class="close-btn" @click="$emit('close')" :aria-label="t('cart.close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="cart-content">
          <div v-if="cartItems.length === 0" class="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>{{ t('cart.empty') }}</p>
          </div>

          <TransitionGroup v-else name="list" tag="div" class="cart-items">
            <CartItemComponent 
              v-for="item in cartItems" 
              :key="item.id" 
              :item="item"
              @remove="handleRemove"
            />
          </TransitionGroup>
        </div>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-summary">
            <span class="items-count">
              {{ cartItems.length }} {{ itemsLabel }}
            </span>
            <div class="total-price">
              <span class="total-label">{{ t('cart.total') }}:</span>
              <span class="total-amount">${{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '../composables/useCart'
import CartItemComponent from './CartItem.vue'

const { t } = useI18n()
const { cartItems, totalPrice, removeFromCart } = useCart()

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const itemsLabel = computed(() => {
  const parts = t('cart.items').split('|')
  return cartItems.value.length === 1 ? (parts[0]?.trim() || 'item') : (parts[1]?.trim() || 'items')
})

const handleRemove = (albumId: number) => {
  removeFromCart(albumId)
}
</script>

<style scoped>
.cart-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-panel {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d1b4e 100%);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.cart-empty svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 1.1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.items-count {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 1.1rem;
  color: white;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4ade80;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active .cart-panel,
.slide-leave-active .cart-panel {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .cart-panel,
.slide-leave-to .cart-panel {
  transform: translateX(100%);
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
