<template>
  <q-page class="flex flex-center items-center justify-center bg-grey-2"> 
    <q-card class="my-card column items-center shadow-3"> 
      
      <q-card-section class="bg-primary text-white text-h5 text-center q-pa-md q-mb-lg full-width app-header">
        Nounoutrice
      </q-card-section>

      <q-card-section class="q-mb-md items-center justify-center section-plages">
        <div class="text-h6 text-grey-8 q-mb-lg text-center">Plages horaires</div>
        
        <div v-for="(plage, index) in store.plages" :key="index" class="row items-center justify-center q-gutter-md q-mb-lg plage-item">
          
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
          
          <div class="column items-center">
            <div class="text-subtitle1 text-grey-7 q-mb-xs display-hours">{{ plage.min < 10 ? '0' + plage.min : plage.min }}:00 - {{ plage.max < 10 ? '0' + plage.max : plage.max }}:00</div>
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
              class="input-time-range"
            />
             <div class="row justify-between q-mt-sm text-grey-7 text-caption">
              <span>Début</span>
              <span>Fin</span>
            </div>
          </div>
          
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
              class="q-mb-xs knob-repetition"
            >
              <div class="absolute-center text-h5 display-repetition">x{{ plage.repetition }}</div>
            </q-knob>
            <div class="text-caption text-grey-7">Jours/semaine</div>
          </div>
        </div>
        
        <q-btn 
          round 
          color="primary" 
          icon="add" 
          dense 
          @click="store.addPlage" 
          size="md" 
          class="q-mt-lg shadow-1 btn-add-plage" />
      </q-card-section>

      <q-card-section class="q-mt-xl q-mb-lg column items-center section-tarif">
        <div class="text-h6 text-grey-8 q-mb-lg">Tarif net</div>
        
        <div class="gauge-container">
          <svg viewBox="0 0 120 120" class="gauge-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" stroke-width="10"></circle>
            <circle 
              cx="60" cy="60" r="50" fill="none" 
              stroke="#00796B" stroke-width="10" 
              transform="rotate(-90 60 60)"
              :stroke-dasharray="314.16" 
              :stroke-dashoffset="314.16 * (1 - (store.tarif / 20))"> 
            </circle>
          </svg>
          <div class="gauge-value absolute-center text-h4 display-tarif">
             {{ store.tarifFormated }} €/h
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row items-center justify-center q-mt-lg q-gutter-lg section-options">
        <div class="row items-center">
          <q-btn unelevated round icon="person" color="grey-7" class="shadow-1 q-mr-sm" />
          <div class="text-subtitle1 label-enfants">{{ store.deuxEnfants ? '2 enfants' : '1 enfant' }}</div>
          <q-toggle hide-underline v-model="store.deuxEnfants" color="green-5" class="toggle-enfants" />
        </div>
        <div class="row items-center">
          <q-btn unelevated round icon="event" color="grey-7" class="shadow-1 q-mr-sm" />
          <div class="text-subtitle1 label-annee">{{ store.anneeComplete ? 'Année complète' : 'Année incomplète' }}</div>
          <q-toggle hide-underline v-model="store.anneeComplete" color="blue-5" class="toggle-annee" />
        </div>
      </q-card-section>

      <q-card-section class="bg-green-1 q-mt-xl text-center summary-card full-width">
        <div class="text-h5 q-mb-sm display-total-semaine">Total semaine : <strong>{{ store.totalHeuresSemaine }}h</strong></div>
        <div class="text-h6 q-mb-xs display-tarif-net">Tarif net : {{ store.tarifFormated }} €/h</div>
        <div class="text-h4 q-mb-xs display-total-mensuel">Coût mensuel : ~{{ store.totalMensuel }} €/mois</div>
        <div class="text-body1 display-heures-sup" v-if="store.heuresSup > 0">
          dont ~{{ store.heuresSup }}h à {{ store.tarifHeuresSup.toFixed(2) }}€/h
        </div>
        <div class="text-body1 q-mb-md display-indemnites">+ {{ store.indemniteMensuelle }}€ d'indemnités</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useNounoutriceStore } from '../stores/nounoutrice';
const store = useNounoutriceStore();
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 550px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); 
  border-radius: 12px; 
  background-color: #ffffff; 
}

.q-page {
  background-color: #f5f5f5; 
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.q-range {
  min-height: 50px; 
  margin-bottom: 10px;
}
.q-range__model { 
  color: #1976D2; 
}
.q-range__label {
  font-size: 0.8em; 
  color: #616161;
}

.gauge-container {
  position: relative;
  width: 150px; 
  height: 150px;
}
.gauge-svg {
  width: 100%;
  height: 100%;
}
.gauge-svg circle {
  transition: stroke-dashoffset 0.5s ease-in-out; 
}
.gauge-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #00796B; 
}

.q-knob__value.absolute-center.text-h5 {
  font-weight: bold;
  font-size: 1.6em; 
}

.q-toggle__inner {
  position: relative;
  padding-left: 40px; 
}
.q-toggle__inner::before { 
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
.q-toggle__inner::after { 
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
