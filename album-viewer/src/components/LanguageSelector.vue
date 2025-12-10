<template>
  <div class="language-selector">
    <select v-model="selectedLocale" @change="handleLocaleChange" class="locale-select">
      <option value="en">🇬🇧 EN</option>
      <option value="fr">🇫🇷 FR</option>
      <option value="de">🇩🇪 DE</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n, type Locale } from '../i18n'

const { locale, setLocale } = useI18n()
const selectedLocale = ref<Locale>(locale.value)

watch(locale, (newLocale) => {
  selectedLocale.value = newLocale
})

const handleLocaleChange = (): void => {
  setLocale(selectedLocale.value)
}
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
}

.locale-select {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  outline: none;
}

.locale-select:hover {
  background: rgba(255, 255, 255, 0.3);
}

.locale-select option {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .locale-select {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
