<template>
  <div class="language-selector">
    <label for="language-select">{{ t('language.select') }}:</label>
    <select 
      id="language-select" 
      v-model="currentLocale" 
      @change="changeLanguage"
      class="language-dropdown"
    >
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const currentLocale = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('userLanguage', currentLocale.value)
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('userLanguage')
  if (savedLanguage && ['en', 'fr', 'de'].includes(savedLanguage)) {
    currentLocale.value = savedLanguage
    locale.value = savedLanguage
  }
})
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-selector label {
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
}

.language-dropdown {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.language-dropdown:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-dropdown:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.language-dropdown option {
  background: #2d3748;
  color: white;
}
</style>
