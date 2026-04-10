import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNounoutriceStore = defineStore('nounoutrice', () => {
  // Structure stable pour q-range : { min, max }
  const plages = ref([
    { min: 9, max: 16, repetition: 5 } 
  ])

  const tarif = ref(4.00)
  const deuxEnfants = ref(false)
  const anneeComplete = ref(true)
  const semainesIncomplete = ref(47)

  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      // Sécurité : forcer le type Number pour éviter NaN lors des drags
      const diff = Number(plage.max) - Number(plage.min)
      return total + (diff * Number(plage.repetition))
    }, 0)
  })

  const heuresNormales = computed(() => Math.min(totalHeuresSemaine.value, 45))
  const heuresSup = computed(() => Math.max(0, totalHeuresSemaine.value - 45))
  const tarifHeuresSup = computed(() => tarif.value * 1.25)

  const totalHeuresMensuel = computed(() => {
    const base = anneeComplete.value ? 52 : semainesIncomplete.value
    return (totalHeuresSemaine.value * base) / 12
  })

  const totalMensuel = computed(() => {
    const hNormMens = (heuresNormales.value * (anneeComplete.value ? 52 : semainesIncomplete.value)) / 12
    const hSupMens = (heuresSup.value * (anneeComplete.value ? 52 : semainesIncomplete.value)) / 12
    return (hNormMens * tarif.value + hSupMens * tarifHeuresSup.value).toFixed(0)
  })

  const indemniteMensuelle = computed(() => {
    const totalJours = plages.value.reduce((t, p) => t + Number(p.repetition), 0)
    return ((totalJours * 4 * 52) / 12).toFixed(0)
  })

  function addPlage() {
    plages.value.push({ min: 9, max: 16, repetition: 1 })
  }

  function removePlage(index) {
    if (plages.value.length > 1) plages.value.splice(index, 1)
  }

  return {
    plages, tarif, deuxEnfants, anneeComplete, semainesIncomplete,
    totalHeuresSemaine, heuresSup, tarifHeuresSup, totalMensuel, 
    indemniteMensuelle, addPlage, removePlage
  }
})
