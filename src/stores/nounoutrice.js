import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNounoutriceStore = defineStore('nounoutrice', () => {
  // Plage horaire par défaut
  const plages = ref([
    { debut: 9, fin: 16, repetition: 5 }
  ])

  const tarif = ref(4.00)
  const deuxEnfants = ref(false)
  const anneeComplete = ref(true)
  const semainesIncomplete = ref(47)

  // Calculs
  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      return total + (plage.fin - plage.debut) * plage.repetition
    }, 0)
  })

  const heuresNormales = computed(() => {
    return Math.min(totalHeuresSemaine.value, 45)
  })

  const heuresSup = computed(() => {
    return Math.max(0, totalHeuresSemaine.value - 45)
  })

  const tarifHeuresSup = computed(() => {
    return tarif.value * 1.25
  })

  const totalHeuresMensuel = computed(() => {
    if (anneeComplete.value) {
      return totalHeuresSemaine.value * 52 / 12
    }
    return totalHeuresSemaine.value * semainesIncomplete.value / 12
  })

  const totalMensuel = computed(() => {
    const heuresNormalesMensuel = Math.min(totalHeuresMensuel.value, heuresNormales.value * 52 / 12)
    const heuresSupMensuel = Math.max(0, totalHeuresMensuel.value - heuresNormalesMensuel)
    
    return (heuresNormalesMensuel * tarif.value + heuresSupMensuel * tarifHeuresSup.value).toFixed(0)
  })

  const indemniteMensuelle = computed(() => {
    return (getTotalRepetition() * 4 * 52 / 12).toFixed(0)
  })

  const tarifFormated = computed(() => {
    return tarif.value.toFixed(2)
  })

  const deuxEnfantsLabel = computed(() => {
    return deuxEnfants.value ? '2 enfants' : '1 enfant'
  })

  const anneeIncompleteLabel = computed(() => {
    return anneeComplete.value ? 'Année complète' : 'Année incomplète'
  })

  function getTotalRepetition() {
    return plages.value.reduce((total, plage) => total + plage.repetition, 0)
  }

  function addPlage() {
    plages.value.push({ debut: 9, fin: 16, repetition: 1 })
  }

  function removePlage(index) {
    if (plages.value.length > 1) {
      plages.value.splice(index, 1)
    }
  }

  function updatePlage(index, field, value) {
    plages.value[index][field] = value
  }

  return {
    plages,
    tarif,
    deuxEnfants,
    anneeComplete,
    semainesIncomplete,
    totalHeuresSemaine,
    heuresSup,
    tarifHeuresSup,
    totalMensuel,
    indemniteMensuelle,
    tarifFormated,
    deuxEnfantsLabel,
    anneeIncompleteLabel,
    addPlage,
    removePlage,
    updatePlage,
    getTotalRepetition
  }
})
