<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card column items-center">
      <q-card-section class="text-h6 text-center">
        Nounoutrice
      </q-card-section>

      <q-card-section class="q-mt-md">
        <!-- Plages horaires avec q-range -->
        <div class="row items-center q-mb-lg">
          <div class="col-2 q-mr-md">
            <q-icon name="close" color="negative" size="md" class="cursor-pointer" @click="store.removePlage(0)" :disable="store.plages.length <= 1" />
          </div>
          <div class="col-8">
            <q-range
              v-model="store.plages[0]"
              :min="0"
              :max="24"
              label-always
              snap
              class="q-mb-lg"
              style="max-width: 300px;"
              color="primary"
            />
            <div class="row justify-between text-grey-7">
              <span class="text-subtitle1">{{ store.plages[0].from_hour }}:00</span>
              <span class="text-subtitle1">{{ store.plages[0].to_hour }}:00</span>
            </div>
          </div>
          <div class="col-2 q-ml-md">
            <q-btn
              round
              color="primary"
              icon="add"
              dense
              @click="store.addPlage"
              size="sm"
              class="q-ml-sm"
            />
          </div>
        </div>

        <!-- Répétition (avec QKnob) -->
        <div class="row items-center justify-center q-mt-lg q-mb-xl">
           <q-knob
            v-model="store.plages[0].repetition"
            :min="1"
            :max="7"
            :step="1"
            size="100px"
            color="accent"
            track-color="grey-3"
            readonly
            class="q-ma-md"
          >
            <div class="absolute-center text-h4">{{ store.plages[0].repetition }}x</div>
          </q-knob>
        </div>
      </q-card-section>

      <!-- Tarif net (avec QKnob) -->
      <q-card-section class="q-mt-md q-mb-lg">
        <div class="text-h6 text-center q-mb-lg">Tarif net</div>
        <q-knob
          v-model="store.tarif"
          :min="0"
          :max="20"
          :step="0.5"
          readonly
          show-value
          color="teal"
          track-color="grey-3"
          size="150px"
          class="text-h4"
        >
          {{ store.tarifFormated }} €/h
        </q-knob>
      </q-card-section>

      <!-- Options -->
      <q-card-section class="row items-center justify-center q-mt-lg q-gutter-md">
        <q-toggle v-model="store.deuxEnfants" color="green-5" icon="person" label="1 enfant" />
        <q-toggle v-model="store.anneeComplete" color="blue-5" icon="event" label="Année complète" />
      </q-card-section>

      <!-- Résultats -->
      <q-card-section class="bg-green-1 q-mt-xl text-center summary-card">
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

// Ajustements pour le q-range
// Le store doit gérer la plage [debut, fin] au lieu de debut/fin séparés
// Pour l'instant, on passe par le store.plages[0] qui devra être adapté
// Si q-range modifie directement store.plages[0].from_hour et store.plages[0].to_hour
// Assurez-vous que le store.plages est un objet { from_hour: number, to_hour: number, repetition: number }

// Si le q-range utilise v-model="store.plages[0]" et que store.plages[0] est { from_hour: ..., to_hour: ... }
// Il faudrait que l'objet dans store.plages ressemble à cela :
// plages: ref([{ from_hour: 9, to_hour: 16, repetition: 5 }])

// Les propriétés 'from_hour' et 'to_hour' sont supposées être dans l'objet plage.
// Si le store les appelle différemment, ajustez ici.
// Assurez-vous que le 'q-range' fonctionne avec la structure de données actuelle du store.
// Pour l'instant, on suppose que 'store.plages[0]' sera interprété comme { from: ..., to: ... } par q-range
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 600px; /* Ajuster la largeur max pour le rendu */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Ajout d'ombre douce */
}

.q-page {
  background-color: #f5f5f5; /* Fond léger pour la page */
  align-items: center;
  justify-content: center;
}

/* Styles spécifiques pour le QKnob tarif */
.q-knob__value {
  font-size: 1.5em; /* Ajuster la taille du texte dans le knob */
}

/* Style pour le QKnob répétition */
.q-knob--readonly .q-knob__content {
  font-size: 1.2em; /* Ajuster la taille du texte */
}

/* Styles pour les toggles avec icônes */
.q-toggle__inner--left-label .q-toggle__label {
  margin-left: 8px; /* Espace entre icône et label */
}

.summary-card {
  border-radius: 8px;
  background-color: #e8f5e9; /* Couleur verte claire pour le résumé */
}
</style>
