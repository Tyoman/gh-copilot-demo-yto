import { ref, computed, watch } from 'vue'
import type { CartItem } from '../types/cart'
import type { Album } from '../types/album'

const CART_STORAGE_KEY = 'album-viewer-cart'

// Shared state across all components
const cartItems = ref<CartItem[]>([])

// Load cart from localStorage on initialization
const loadCartFromStorage = (): void => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      cartItems.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
}

// Save cart to localStorage
const saveCartToStorage = (): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

// Initialize cart on first load
if (cartItems.value.length === 0) {
  loadCartFromStorage()
}

// Watch for changes and save to localStorage
watch(cartItems, saveCartToStorage, { deep: true })

export function useCart() {
  const cartCount = computed(() => cartItems.value.length)
  
  const totalPrice = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )
  
  const addToCart = (album: Album): void => {
    // Check if album already exists in cart
    if (!isInCart(album.id)) {
      const cartItem: CartItem = {
        id: album.id,
        title: album.title,
        artist: album.artist,
        price: album.price,
        image_url: album.image_url
      }
      cartItems.value.push(cartItem)
    }
  }
  
  const removeFromCart = (albumId: number): void => {
    const index = cartItems.value.findIndex(item => item.id === albumId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }
  
  const isInCart = (albumId: number): boolean => {
    return cartItems.value.some(item => item.id === albumId)
  }
  
  const clearCart = (): void => {
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
