<template>
  <q-page class="flex flex-center items-center justify-center bg-grey-2"> 
    <q-card class="my-card column items-center shadow-3"> 
      
      <q-card-section class="bg-primary text-white text-h5 text-center q-pa-md q-mb-sm full-width app-header">
        Nounoutrice
      </q-card-section>

      <!-- Fieldset Plages horaires -->
      <q-card-section class="full-width section-plages">
        <div class="text-h6 text-grey-8 q-mb-md text-center">Plages horaires</div>
        
        <div v-for="(plage, index) in store.plages" :key="index" class="row items-center justify-between q-mb-sm plage-item">
          
          <q-btn
            round
            color="negative"
            icon="close"
            dense
            @click="store.removePlage(index)"
            :disable="store.plages.length <= 1"
            size="sm"
            class="shadow-1 btn-remove-plage"
          />
          
          <div class="column items-center q-ml-sm" style="flex: 1;">
            <div class="text-subtitle2 text-grey-7 q-mb-xs display-hours">{{ formatHours(plage.min) }} - {{ formatHours(plage.max) }}</div>
            <q-range
              v-model="makePlageRange(index).value"
              :min="0"
              :max="24"
              label-always
              snap
              color="primary"
              style="width: 100%; max-width: 280px;"
              drag-range
              dense
              class="input-time-range"
            />
          </div>
          
          <div class="column items-center q-ml-sm">
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
            <div class="text-caption text-grey-7">Jours</div>
          </div>
        </div>

        <!-- Total semaine (placé ici, après les plages) -->
        <div class="text-center q-mt-md q-pt-md" style="border-top: 1px solid #e0e0e0;">
          <div class="text-subtitle1 text-grey-8 display-total-semaine">
            Total semaine : <strong>{{ store.totalHeuresSemaine }}h</strong>
            <span v-if="store.totalJours > 6" class="text-negative text-caption q-ml-sm">(max 6 jours !)</span>
          </div>
        </div>

        <!-- Bouton ajouter avec label -->
        <div class="row items-center justify-center q-mt-md">
          <q-btn 
            color="primary" 
            icon="add" 
            dense 
            @click="store.addPlage" 
            size="md" 
            class="shadow-1 btn-add-plage"
            :label="'Ajouter une plage'"
            flat
          />
        </div>
      </q-card-section>

      <q-card-section class="q-mb-md column items-center section-tarif">
        <div class="text-h6 text-grey-8 q-mb-md">Tarif net</div>
        
        <q-knob
          v-model="store.tarif"
          :min="0"
          :max="20"
          :step="0.1"
          show-value
          size="120px"
          color="teal"
          track-color="grey-3"
          class="text-h4 display-tarif-knob"
        >
          <div class="column items-center">
            <span class="display-tarif">{{ store.tarifFormated }}</span>
            <span class="text-caption">€/h</span>
          </div>
        </q-knob>
      </q-card-section>

      <q-card-section class="row items-center justify-center q-gutter-md section-options full-width">
        <div class="row items-center">
          <q-btn unelevated round icon="person" color="grey-7" class="shadow-1 q-mr-sm" size="sm" />
          <div class="text-subtitle2 label-enfants">{{ store.deuxEnfants ? '2 enfants' : '1 enfant' }}</div>
          <q-toggle v-model="store.deuxEnfants" color="green-5" class="toggle-enfants" dense />
        </div>
        <div class="row items-center">
          <q-btn unelevated round icon="event" color="grey-7" class="shadow-1 q-mr-sm" size="sm" />
          <div class="text-subtitle2 label-annee">{{ store.anneeComplete ? 'Année complète' : 'Année incomplète' }}</div>
          <q-toggle v-model="store.anneeComplete" color="blue-5" class="toggle-annee" dense />
        </div>
      </q-card-section>

      <q-card-section class="bg-green-1 q-mt-md text-center summary-card full-width">
        <div class="text-h4 q-mb-xs display-total-mensuel">Coût mensuel : ~{{ store.totalMensuel }} €/mois</div>
        <div class="text-body1" v-if="store.heuresSupMensuelles > 0">
          dont ~{{ store.heuresSupMensuelles }}h à {{ store.tarifHeuresSup.toFixed(2) }}€/h
        </div>
        <div class="text-body1 q-mb-sm display-indemnites">+ {{ store.indemniteMensuelle }}€ d'indemnités</div>
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

// Formatage heures
function formatHours(h) {
  return h < 10 ? '0' + h + ':00' : h + ':00'
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); 
  border-radius: 12px; 
  background-color: #ffffff; 
}
.q-page {
  background-color: #f5f5f5; 
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.summary-card {
  border-radius: 10px;
  background-color: #e8f5e9;
}
.section-plages {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 8px;
  padding: 16px;
  background-color: #fafafa;
}
.plage-item {
  padding: 8px 0;
}
</style>