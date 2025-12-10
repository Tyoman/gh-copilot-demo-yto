import { ref, computed } from 'vue'
import en from './locales/en'
import fr from './locales/fr'
import de from './locales/de'

const LOCALE_STORAGE_KEY = 'album-viewer-locale'

export type Locale = 'en' | 'fr' | 'de'

const messages = {
  en,
  fr,
  de
}

const currentLocale = ref<Locale>('en')

// Load locale from localStorage on initialization
const loadLocaleFromStorage = (): void => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && (stored === 'en' || stored === 'fr' || stored === 'de')) {
      currentLocale.value = stored as Locale
    }
  } catch (error) {
    console.error('Failed to load locale from localStorage:', error)
  }
}

// Initialize locale
loadLocaleFromStorage()

export function useI18n() {
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let value: any = messages[currentLocale.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      return key
    }
    
    // Handle pluralization (simple implementation)
    if (params?.count !== undefined && value.includes('|')) {
      const [singular, plural] = value.split('|').map(s => s.trim())
      value = params.count === 1 ? singular : plural
    }
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        value = value.replace(`{${param}}`, params[param])
      })
    }
    
    return value
  }
  
  const setLocale = (locale: Locale): void => {
    currentLocale.value = locale
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch (error) {
      console.error('Failed to save locale to localStorage:', error)
    }
  }
  
  const locale = computed(() => currentLocale.value)
  
  return {
    t,
    setLocale,
    locale
  }
}
