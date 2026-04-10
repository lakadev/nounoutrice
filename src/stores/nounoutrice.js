import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNounoutriceStore = defineStore('nounoutrice', () => {
  // Plages horaires: min (début), max (fin), repetition (jours/semaine)
  // Ces noms sont utilisés par q-range directement via v-model.
  const plages = ref([
    { min: 9, max: 16, repetition: 5 } // Initialisation avec des valeurs par défaut
  ]);

  const tarif = ref(4.00);
  const deuxEnfants = ref(false); // Ce toggle semble correspondre à un "nombre d'enfants"
  const anneeComplete = ref(true);
  const semainesIncomplete = ref(47);

  // Calculs
  const totalHeuresSemaine = computed(() => {
    return plages.value.reduce((total, plage) => {
      // Utilise min et max pour le calcul des heures
      return total + (plage.max - plage.min) * plage.repetition;
    }, 0);
  });

  const heuresNormales = computed(() => {
    return Math.min(totalHeuresSemaine.value, 45);
  });

  const heuresSup = computed(() => {
    return Math.max(0, totalHeuresSemaine.value - 45);
  });

  const tarifHeuresSup = computed(() => {
    return tarif.value * 1.25;
  });

  const totalHeuresMensuel = computed(() => {
    if (anneeComplete.value) {
      // Calcul basé sur 52 semaines par an
      return totalHeuresSemaine.value * 52 / 12;
    }
    // Calcul basé sur le nombre de semaines incomplètes
    return totalHeuresSemaine.value * semainesIncomplete.value / 12;
  });

  const totalMensuel = computed(() => {
    // Recalcul du coût mensuel en utilisant les heures normales et supp
    const heuresNormalesMensuel = Math.min(totalHeuresMensuel.value, heuresNormales.value * 52 / 12);
    const heuresSupMensuel = Math.max(0, totalHeuresMensuel.value - heuresNormalesMensuel);

    const coutNormal = heuresNormalesMensuel * tarif.value;
    const coutSup = heuresSupMensuel * tarifHeuresSup.value;

    return (coutNormal + coutSup).toFixed(0);
  });

  const indemniteMensuelle = computed(() => {
    // Calcul de l'indemnité basé sur le total de répétitions par semaine
    return (getTotalRepetition() * 4 * 52 / 12).toFixed(0);
  });

  const tarifFormated = computed(() => {
    return tarif.value.toFixed(2);
  });

  const deuxEnfantsLabel = computed(() => {
    return deuxEnfants.value ? '2 enfants' : '1 enfant';
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

  // La fonction updatePlage n'est plus nécessaire car q-range bind directement min/max et repetition est bindé séparément.

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
