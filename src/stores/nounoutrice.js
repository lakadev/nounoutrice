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

  // Total jours/semaine (max 6)
  const totalJours = computed(() => {
    return plages.value.reduce((sum, p) => sum + Number(p.repetition), 0)
  })

  // Total heures/semaine
  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      const diff = Number(plage.max) - Number(plage.min)
      return total + (diff * Number(plage.repetition))
    }, 0)
  })

  // Répartition heures normales vs heures sup
  // Heures sup = heures au-delà de 45h/semaine
  const heuresNormales = computed(() => Math.min(totalHeuresSemaine.value, 45))
  const heuresSup = computed(() => Math.max(0, totalHeuresSemaine.value - 45))

  // Tarif heures sup (majoration 25%)
  const tarifHeuresSup = computed(() => tarif.value * 1.25)

  // Majoration deux enfants (50% de plus sur le tarif de base)
  const coefEnfants = computed(() => deuxEnfants.value ? 1.5 : 1.0)

  // Coût mensuel
  // ((heures normaux * 52 sem) / 12) * tarif + ((heures sup * 52 sem) / 12) * tarifHS
  const totalMensuel = computed(() => {
    const baseSemaines = anneeComplete.value ? 52 : semainesIncomplete.value
    const hNormMens = (heuresNormales.value * baseSemaines) / 12
    const hSupMens = (heuresSup.value * baseSemaines) / 12
    const tarifApplique = tarif.value * coefEnfants.value
    const tarifHSApplique = tarifHeuresSup.value * coefEnfants.value
    return Math.round(hNormMens * tarifApplique + hSupMens * tarifHSApplique)
  })

  // Heures supplémentaires MENSUELLES (pas hebdomadaires!)
  const heuresSupMensuelles = computed(() => {
    const baseSemaines = anneeComplete.value ? 52 : semainesIncomplete.value
    return Math.round((heuresSup.value * baseSemaines) / 12)
  })

  // Indemnités mensuelles (entretien journalier)
  const indemniteMensuelle = computed(() => {
    // ~2.65€ (min) à 4.65€ par jour d'accueil
    // Pour nounou: indemnités journalières × jours/semaine × semaines / 12
    const totalJours = plages.value.reduce((t, p) => t + Number(p.repetition), 0)
    const baseSemaines = anneeComplete.value ? 52 : semainesIncomplete.value
    const indemniteJournaliere = deuxEnfants.value ? 4.65 : 4.65 // même valeur, peut-être ×2 pour 2 enfants
    return Math.round((totalJours * baseSemaines * indemniteJournaliere) / 12)
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
    totalJours, totalHeuresSemaine, heuresSup, heuresSupMensuelles,
    tarifHeuresSup, coefEnfants, totalMensuel, indemniteMensuelle,
    tarifFormated, addPlage, removePlage, plageRange
  }
})