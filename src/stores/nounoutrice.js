import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNounoutriceStore = defineStore('nounoutrice', () => {
  // Structure stable pour q-range : min, max
  const plages = ref([
    { min: 9, max: 16, repetition: 5 } 
  ])

  const tarif = ref(4.00)
  const deuxEnfants = ref(false)
  const anneeComplete = ref(true)
  const semainesIncomplete = ref(47)

  // Calculs avec typage Number forcé pour éviter les NaN
  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      const diff = Number(plage.max) - Number(plage.min)
      return total + (diff * Number(plage.repetition))
    }, 0)
  })

  // Autres calculs stabilisés
  const heuresNormales = computed(() => Math.min(totalHeuresSemaine.value, 45))
  const heuresSup = computed(() => Math.max(0, totalHeuresSemaine.value - 45))
  const tarifHeuresSup = computed(() => tarif.value * 1.25)

  const totalMensuel = computed(() => {
    const baseSemaines = anneeComplete.value ? 52 : semainesIncomplete.value
    const hNormMens = (heuresNormales.value * baseSemaines) / 12
    const hSupMens = (heuresSup.value * baseSemaines) / 12
    return (hNormMens * tarif.value + hSupMens * tarifHeuresSup.value).toFixed(0)
  })

  const indemniteMensuelle = computed(() => {
    const totalJours = plages.value.reduce((t, p) => t + Number(p.repetition), 0)
    return ((totalJours * 4 * 52) / 12).toFixed(0)
  })

  const tarifFormated = computed(() => Number(tarif.value).toFixed(2))

  function addPlage() {
    plages.value.push({ min: 9, max: 16, repetition: 1 })
  }

  function removePlage(index) {
    if (plages.value.length > 1) plages.value.splice(index, 1)
  }

  // Retourne un objet reactive {min, max} pour q-range, sans toucher à repetition
  function plageRange(index) {
    return {
      get min() { return plages.value[index].min },
      set min(v) { plages.value[index].min = Number(v) },
      get max() { return plages.value[index].max },
      set max(v) { plages.value[index].max = Number(v) },
    }
  }

  return {
    plages, tarif, deuxEnfants, anneeComplete, semainesIncomplete,
    totalHeuresSemaine, heuresSup, tarifHeuresSup, totalMensuel, 
    indemniteMensuelle, tarifFormated, addPlage, removePlage, plageRange
  }
})
