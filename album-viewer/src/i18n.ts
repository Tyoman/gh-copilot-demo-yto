import { createI18n } from 'vue-i18n'
import en from './locales/en'
import fr from './locales/fr'
import de from './locales/de'

const messages = {
  en,
  fr,
  de
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
