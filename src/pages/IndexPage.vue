<template>
  <q-page class="flex flex-center items-center justify-center bg-grey-2"> 
    <q-card class="my-card column items-center shadow-3"> 
      <q-card-section class="bg-primary text-white text-h5 text-center q-pa-md q-mb-lg full-width">
        Nounoutrice
      </q-card-section>

      <q-card-section class="q-mb-md items-center justify-center">
        <div class="text-h6 text-grey-8 q-mb-lg text-center">Plages horaires</div>
        
        <!-- Section Plages Horaires avec q-range stylisé -->
        <div v-for="(plage, index) in store.plages" :key="index" class="row items-center justify-center q-gutter-md q-mb-lg">
          
          <!-- Bouton Supprimer -->
          <q-btn
            round
            color="negative"
            icon="close"
            dense
            @click="store.removePlage(index)"
            :disable="store.plages.length <= 1"
            size="sm"
            class="shadow-1"
          />
          
          <!-- q-range pour Heures début/fin -->
          <div class="column items-center">
            <div class="text-subtitle1 text-grey-7 q-mb-xs">{{ plage.from_hour }}:00 - {{ plage.to_hour }}:00</div>
            <q-range
              v-model="store.plages[index]" 
              :min="0"
              :max="24"
              label-always
              snap
              color="primary"
              style="width: 200px;" 
              drag-range
              dense
            />
             <div class="row justify-between q-mt-sm text-grey-7 text-caption">
              <span>Début</span>
              <span>Fin</span>
            </div>
          </div>
          
          <!-- q-knob pour Jours/semaine (Répétition) -->
          <div class="column items-center">
            <q-knob
              v-model="plage.repetition"
              :min="1"
              :max="7"
              :step="1"
              size="90px"
              color="accent"
              track-color="grey-2"
              readonly
              show-value
              class="q-mb-xs"
            >
              <div class="absolute-center text-h5">{{ plage.repetition }}x</div>
            </q-knob>
            <div class="text-caption text-grey-7">Jours/semaine</div>
          </div>
        </div>
        
        <!-- Bouton Ajouter Plage -->
        <q-btn 
          round 
          color="primary" 
          icon="add" 
          dense 
          @click="store.addPlage" 
          size="md" 
          class="q-mt-lg shadow-1" />
      </q-card-section>

      <!-- Tarif net (avec Jauge Semi-Circulaire stylisée) -->
      <q-card-section class="q-mt-xl q-mb-lg column items-center tarif-card">
        <div class="text-h6 text-grey-8 q-mb-lg">Tarif net</div>
        
        <div class="gauge-container">
          <svg viewBox="0 0 120 120" class="gauge-svg">
            <!-- Fond du cercle -->
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" stroke-width="10"></circle>
            <!-- Partie active de la jauge -->
            <circle 
              cx="60" cy="60" r="50" fill="none" 
              stroke="#00796B" stroke-width="10" 
              transform="rotate(-90 60 60)"
              stroke-dasharray="314.16" 
              :stroke-dashoffset="314.16 * (1 - (store.tarif / 20))"> 
            </circle>
          </svg>
          <div class="gauge-value absolute-center text-h4">
             {{ store.tarifFormated }} €/h
          </div>
        </div>
      </q-card-section>

      <!-- Options (Enfants/Année) -->
      <q-card-section class="row items-center justify-center q-mt-lg q-gutter-lg">
        <div class="row items-center">
          <q-btn unelevated round icon="person" color="grey-7" class="shadow-1 q-mr-sm" />
          <div class="text-subtitle1">1 enfant</div>
          <q-toggle hide-underline v-model="store.deuxEnfants" color="green-5" />
        </div>
        <div class="row items-center">
          <q-btn unelevated round icon="event" color="grey-7" class="shadow-1 q-mr-sm" />
          <div class="text-subtitle1">Année complète</div>
          <q-toggle hide-underline v-model="store.anneeComplete" color="blue-5" />
        </div>
      </q-card-section>

      <!-- Résultats -->
      <q-card-section class="bg-green-1 q-mt-xl text-center summary-card full-width">
        <div class="text-h5 q-mb-sm">Total semaine : <strong>{{ store.totalHeuresSemaine }}h</strong></div>
        <div class="text-h6 q-mb-xs">Tarif net : {{ store.tarifFormated }} €/h</div>
        <div class="text-h4 q-mb-xs">Coût mensuel : ~{{ store.totalMensuel }} €/mois</div>
        <div class="text-body1" v-if="store.heuresSup > 0">
          dont ~{{ store.heuresSup }}h à {{ store.tarifHeuresSup.toFixed(2) }}€/h
        </div>
        <div class="text-body1 q-mb-md">+ {{ store.indemniteMensuelle }}€ d'indemnités</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNounoutriceStore } from '../stores/nounoutrice';

const store = useNounoutriceStore();

// Le store.plages doit maintenant être de la forme [{ from_hour: number, to_hour: number, repetition: number }]
// Adaptez vos méthodes dans le store si nécessaire pour gérer cela correctement.
// Par exemple, si vous modifiez plage.from_hour ou plage.to_hour, assurez-vous que le q-range est bien lié.

// Simulation de données pour tester le q-range si le store n'est pas encore prêt
// const plageTest = ref({ from_hour: 9, to_hour: 16, repetition: 5 })
// store.plages = [plageTest] // Décommenter pour tester sans le store initialisé


// Le q-knob pour la répétition
const repetitionKnob = computed({
  get() {
    return store.plages[0].repetition;
  },
  set(value) {
    store.plages[0].repetition = value;
  }
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 550px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); /* Ombre plus douce et prononcée */
  border-radius: 12px; /* Coins plus arrondis */
  background-color: #ffffff; /* Fond blanc pour la carte */
}

.q-page {
  background-color: #f5f5f5; /* Fond léger pour la page */
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Style pour le q-range */
.q-range {
  min-height: 60px; /* Plus d'espace pour les labels */
  margin-bottom: 10px;
}
.q-range__model {
  color: #1976D2; /* Couleur primaire Quasar */
}
.q-range__label {
  font-size: 0.8em; /* Taille plus petite pour les labels */
  color: #616161;
}

/* Style pour le QKnob tarif */
.tarif-card {
  position: relative; /* Permet le positionnement absolu du texte */
}
.gauge-container {
  position: relative;
  width: 150px; /* Taille du conteneur */
  height: 150px;
}
.gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Démarre la jauge à 12h */
}
.gauge-svg circle {
  transition: stroke-dashoffset 0.5s ease-in-out; /* Animation douce */
}
.gauge-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #00796B; /* Couleur teal assombrie */
}

/* Style pour le QKnob répétition */
.q-knob__value.absolute-center.text-h5 {
  font-weight: bold;
}

/* Styles pour les toggles avec icônes intégrées */
.q-toggle__inner {
  position: relative;
  padding-left: 40px; /* Espace pour l'icône */
}
.q-toggle__inner::before { /* Icône personne */
  content: '\F30F'; 
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
}
.q-toggle__inner::after { /* Icône calendrier */
  content: '\F4CB'; 
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
}
/* Changer l'icône pour '2 enfants' si nécessaire, sinon laisser la même */
.q-toggle__inner.q-toggle__inner--checked::before { /* Si le toggle '2 enfants' est activé */
   content: '\F30F'; /* Garder la même icône pour l'instant, ou ajuster si vous avez une icône spécifique */
}

/* Styles pour les boutons Ajouter/Supprimer */
.q-btn--round.shadow-1 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px rgba(0,0,0,0.12);
}
.q-btn--round.q-btn--dense {
  min-height: 32px;
  min-width: 32px;
}

.summary-card {
  border-radius: 10px;
  background-color: #e8f5e9;
}
</style>
