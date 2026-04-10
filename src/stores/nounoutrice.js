import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNounoutriceStore = defineStore('nounoutrice', () => {
  // Plage horaire par défaut : min (début), max (fin), repetition (jours/semaine)
  // Noms de propriétés alignés avec les attentes de q-range et q-knob
  const plages = ref([
    { min: 9, max: 16, repetition: 5 } 
  ])

  const tarif = ref(4.00)
  const deuxEnfants = ref(false)
  const anneeComplete = ref(true)
  const semainesIncomplete = ref(47)

  // Calculs
  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      // Utilise min et max qui sont maintenant directement bindés par q-range
      return total + (plage.max - plage.min) * plage.repetition
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
    // Recalcul du coût mensuel en utilisant les heures normales et supp
    const heuresNormalesMensuel = Math.min(totalHeuresMensuel.value, heuresNormales.value * 52 / 12);
    const heuresSupMensuel = Math.max(0, totalHeuresMensuel.value - heuresNormalesMensuel);

    const coutNormal = heuresNormalesMensuel * tarif.value;
    const coutSup = heuresSupMensuel * tarifHeuresSup.value;

    return (coutNormal + coutSup).toFixed(0);
  });


  const indemniteMensuelle = computed(() => {
    // Utiliser la fonction getTotalRepetition() pour le calcul de l'indemnité
    return (getTotalRepetition() * 4 * 52 / 12).toFixed(0);
  });

  const tarifFormated = computed(() => {
    return tarif.value.toFixed(2);
  });

  const deuxEnfantsLabel = computed(() => {
    // Le label pour le toggle d'enfant devrait être mis à jour plus dynamiquement
    // pour afficher "2 enfants" quand deuxEnfants est vrai.
    // Pour l'instant, c'est un label statique.
    return deuxEnfants.value ? '2 enfants' : '1 enfant'; // Ajusté pour plus de clarté
  });

  const anneeIncompleteLabel = computed(() => {
    return anneeComplete.value ? 'Année complète' : 'Année incomplète';
  });

  // Fonction pour obtenir le nombre total de répétitions (jours par semaine)
  function getTotalRepetition() {
    return plages.value.reduce((total, plage) => total + plage.repetition, 0);
  }

  // Fonction pour ajouter une nouvelle plage horaire
  function addPlage() {
    plages.value.push({ min: 9, max: 16, repetition: plages.value.length + 1 });
  }

  // Fonction pour supprimer une plage horaire
  function removePlage(index) {
    if (plages.value.length > 1) {
      plages.value.splice(index, 1);
    }
  }

  // Note: Le q-range dans IndexPage.vue utilise directement v-model="store.plages[index]"
  // Il lie les curseurs aux propriétés min et max de l'objet plage.
  // Il n'y a donc pas besoin de updatePlage si q-range gère min/max directement.

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
    getTotalRepetition
  }
})
