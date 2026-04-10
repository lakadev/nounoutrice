<template>
  <q-page class="flex flex-center items-center justify-center bg-grey-2"> 
    <q-card class="my-card column items-center shadow-3"> 
      
      <q-card-section class="bg-primary text-white text-h5 text-center q-pa-sm full-width app-header">
        Nounoutrice
      </q-card-section>

      <!-- Plages horaires - sans titre -->
      <q-card-section class="full-width section-plages">
        <div v-for="(plage, index) in store.plages" :key="index" class="row items-center plage-item">
          
          <!-- Bouton supprimer - masqué si une seule plage -->
          <q-btn
            v-if="store.plages.length > 1"
            round
            color="negative"
            icon="close"
            dense
            @click="store.removePlage(index)"
            size="sm"
            class="btn-remove-plage"
          />
          <!-- Espaceur quand le bouton est masqué -->
          <div v-else class="spacer-remove"></div>
          
          <!-- Zone horaires centrée -->
          <div class="plage-time-zone">
            <div class="text-subtitle2 text-primary text-center display-hours">{{ plage.max - plage.min }}h</div>
            <q-range
              v-model="makePlageRange(index).value"
              :min="0"
              :max="24"
              :left-label-value="formatTime(plage.min)"
              :right-label-value="formatTime(plage.max)"
              label-always
              snap
              color="primary"
              drag-range
              dense
              class="input-time-range"
            />
          </div>
          
          <!-- Knob répétition aligné verticalement -->
          <q-knob
            v-model="plage.repetition"
            :min="1"
            :max="maxRepetitionFor(index)"
            :step="1"
            size="60px"
            color="accent"
            track-color="grey-2"
            show-value
            class="knob-repetition"
          >
            <div class="absolute-center text-subtitle1 display-repetition">x{{ plage.repetition }}</div>
          </q-knob>
          <div class="text-caption text-grey-7 text-center">Jours</div>
        </div>

        <!-- Bouton ajouter - style outline Quasar -->
        <div class="row items-center justify-center q-mt-xs">
          <q-btn 
            color="primary" 
            icon="add" 
            dense 
            @click="store.addPlage" 
            size="sm" 
            label="Ajouter"
            outline
          />
        </div>

        <!-- Total semaine -->
        <div class="text-center q-mt-sm q-pt-sm total-semaine">
          <div class="text-subtitle2 text-grey-8 display-total-semaine">
            Total semaine : <strong>{{ store.totalHeuresSemaine }}h</strong>
            <span v-if="store.totalJours > 6" class="text-negative text-caption q-ml-xs">(max 6 jours !)</span>
          </div>
        </div>
      </q-card-section>

      <!-- Tarif inline avec label à gauche -->
      <q-card-section class="row items-center justify-center section-tarif full-width q-py-xs">
        <div class="text-subtitle1 text-grey-8 q-mr-md">Tarif net</div>
        <q-knob
          v-model="store.tarif"
          :min="0"
          :max="20"
          :step="0.1"
          show-value
          size="80px"
          color="teal"
          track-color="grey-3"
          class="display-tarif-knob"
        >
          <div class="column items-center">
            <span class="display-tarif">{{ store.tarifFormated }}</span>
            <span class="text-caption">€/h</span>
          </div>
        </q-knob>
      </q-card-section>

      <q-card-section class="row items-center justify-center section-options full-width q-py-xs">
        <div class="row items-center">
          <q-btn unelevated round icon="person" color="grey-7" class="q-mr-xs" size="sm" />
          <div class="text-subtitle2 label-enfants">{{ store.deuxEnfants ? '2 enfants' : '1 enfant' }}</div>
          <q-toggle v-model="store.deuxEnfants" color="green-5" class="toggle-enfants" dense />
        </div>
        <div class="row items-center q-ml-md">
          <q-btn unelevated round icon="event" color="grey-7" class="q-mr-xs" size="sm" />
          <div class="text-subtitle2 label-annee">{{ store.anneeComplete ? 'Année complète' : 'Année incomplète' }}</div>
          <q-toggle v-model="store.anneeComplete" color="blue-5" class="toggle-annee" dense />
        </div>
      </q-card-section>

      <q-card-section class="bg-green-1 text-center summary-card full-width q-py-sm">
        <div class="text-h5 q-mb-xs display-total-mensuel">Coût mensuel : ~{{ store.totalMensuel }} €</div>
        <div class="text-body2" v-if="store.heuresSupMensuelles > 0">
          dont ~{{ store.heuresSupMensuelles }}h à {{ store.tarifHeuresSup.toFixed(2) }}€/h
        </div>
        <div class="text-body2 display-indemnites">+ {{ store.indemniteMensuelle }}€ d'indemnités</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useNounoutriceStore } from '../stores/nounoutrice';
const store = useNounoutriceStore();

// Computed writable pour isoler {min, max} de repetition sur chaque plage
function makePlageRange(index) {
  return computed({
    get: () => ({ min: store.plages[index].min, max: store.plages[index].max }),
    set: (val) => {
      store.plages[index].min = Number(val.min)
      store.plages[index].max = Number(val.max)
    }
  })
}

// Max répétition pour index (6 jours max total)
function maxRepetitionFor(index) {
  const totalOthers = store.plages.reduce((sum, p, i) => i !== index ? sum + p.repetition : sum, 0)
  return Math.max(1, 6 - totalOthers)
}

// Formatage heure HH:00 pour les labels du q-range
function formatTime(h) {
  return String(h).padStart(2, '0') + ':00'
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1); 
  border-radius: 12px; 
  background-color: #ffffff; 
}
.q-page {
  background-color: #f5f5f5; 
  padding: 8px;
}
.summary-card {
  border-radius: 8px;
  background-color: #e8f5e9;
}
.section-plages {
  padding: 8px 12px;
}
.plage-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  gap: 8px;
}
.spacer-remove {
  width: 32px;
}
.plage-time-zone {
  flex: 1;
  min-width: 180px;
  max-width: 240px;
}
.knob-repetition {
  flex-shrink: 0;
}
.total-semaine {
  border-top: 1px solid #e0e0e0;
}
</style>