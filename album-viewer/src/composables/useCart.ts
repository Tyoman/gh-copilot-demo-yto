import { ref, computed, watch } from 'vue'
import type { Album } from '../types/album'

export interface CartItem extends Album {}

const STORAGE_KEY = 'album-viewer-cart'

// Global reactive state
const cartItems = ref<CartItem[]>([])

// Load from localStorage on initialization
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      cartItems.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    cartItems.value = []
  }
}

// Save to localStorage whenever cart changes
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Initialize cart from storage
loadFromStorage()

// Watch for changes and persist
watch(cartItems, saveToStorage, { deep: true })

export function useCart() {
  const cartCount = computed(() => cartItems.value.length)
  
  const totalPrice = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )

  const addToCart = (album: Album): boolean => {
    if (isInCart(album.id)) {
      return false
    }
    cartItems.value.push({ ...album })
    return true
  }

  const removeFromCart = (albumId: number): boolean => {
    const index = cartItems.value.findIndex(item => item.id === albumId)
    if (index === -1) {
      return false
    }
    cartItems.value.splice(index, 1)
    return true
  }

  const isInCart = (albumId: number): boolean => {
    return cartItems.value.some(item => item.id === albumId)
  }

  const clearCart = () => {
    cartItems.value = []
  }

  return {
    cartItems,
    cartCount,
    totalPrice,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart
  }
}
