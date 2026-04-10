<template>
  <q-page class="flex flex-center items-center justify-center bg-grey-2"> 
    <q-card class="my-card column items-center shadow-3"> 
      <q-card-section class="bg-primary text-white text-h5 text-center q-pa-md q-mb-md full-width">
        Nounoutrice
      </q-card-section>

      <q-card-section class="q-mt-md q-mb-md">
        <div class="text-h6 text-grey-8 q-mb-md">Plages horaires</div>
        <div class="row items-center justify-center q-gutter-md">
          <!-- Plage horaire unique avec q-range (simplifié pour l'instant car q-range n'est pas idéal pour plusieurs) -->
          <div class="text-center">
            <div class="text-subtitle1 text-grey-7 q-mb-xs">{{ store.plages[0].from_hour }}:00 - {{ store.plages[0].to_hour }}:00</div>
            <q-range
              v-model="store.plages[0]"
              :min="0"
              :max="24"
              label-always
              snap
              color="primary"
              style="width: 250px;"
              drag-range
              dense
            />
            <div class="row justify-between q-mt-sm text-grey-7 text-caption">
              <span>Début</span>
              <span>Fin</span>
            </div>
          </div>
          
          <!-- Répétition avec q-knob -->
          <div class="column items-center">
            <q-knob
              v-model="store.plages[0].repetition"
              :min="1"
              :max="7"
              :step="1"
              size="80px"
              color="accent"
              track-color="grey-2"
              readonly
              class="q-mb-xs"
            >
              <div class="absolute-center text-h6">{{ store.plages[0].repetition }}x</div>
            </q-knob>
            <div class="text-caption text-grey-7">Répétition</div>
          </div>
        </div>
        <q-btn 
          round 
          color="primary" 
          icon="add" 
          dense 
          @click="store.addPlage" 
          size="md" 
          class="q-mt-md" />
      </q-card-section>

      <!-- Tarif net (avec QKnob stylisé) -->
      <q-card-section class="q-mt-md q-mb-lg column items-center">
        <div class="text-h6 text-grey-8 q-mb-lg">Tarif net</div>
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
        <q-btn unelevated round icon="person" color="grey-7" class="shadow-1" />
        <q-toggle hide-underline v-model="store.deuxEnfants" color="green-5" val="true" />
        <div class="text-subtitle1">1 enfant</div>

        <q-btn unelevated round icon="event" color="grey-7" class="shadow-1" />
        <q-toggle hide-underline v-model="store.anneeComplete" color="blue-5" val="true" />
        <div class="text-subtitle1">Année complète</div>
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
import { useNounoutriceStore } from '../stores/nounoutrice';

const store = useNounoutriceStore();

// Adapter le store pour q-range qui attend { min: number, max: number }
// store.plages[0] doit donc être { from_hour: ..., to_hour: ..., repetition: ... }
// Le q-range utilise v-model="store.plages[0]" directement comme ici.
// Il mappera 'min' et 'max' sur 'from_hour' et 'to_hour' automatiquement si nommé ainsi.
// Si 'plages' est un tableau d'objets { from: ..., to: ... }, assurez-vous qu'il est bien initialisé ainsi.
// Pour q-knob (répétition), on s'attend à une valeur numérique.
// Pour le tarif, on s'attend à une valeur numérique.

// Assurez-vous que le store.plages est bien un objet { from: number, to: number, repetition: number }
// et que vous mettez à jour store.tarif correctement.
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 550px; /* Plus compact */
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); /* Ombre plus douce et prononcée */
  border-radius: 12px; /* Coins plus arrondis */
}

.q-page {
  background-color: #f5f5f5; /* Fond léger */
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Style pour le q-range */
.q-range {
  min-height: 50px; /* Ajuster la hauteur pour que le slider soit bien visible */
}
.q-range__model {
  color: #1976D2; /* Couleur primaire Quasar pour les curseurs */
}

/* Style pour le QKnob tarif */
.q-knob__value {
  font-size: 1.8em; /* Plus grand */
  font-weight: bold;
  color: #00796B; /* Couleur teal assombrie */
}
.q-knob--readonly .q-knob__content {
  font-size: 1.2em;
}

/* Style pour le QTogles avec icônes intégrées */
.q-toggle__inner {
  position: relative;
  padding-left: 40px; /* Espace pour l'icône */
}
.q-toggle__inner::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
}
.q-toggle__inner.q-toggle__inner--left-label::before { /* Pour '1 enfant' */
  content: '\F30F'; /* Ceci est une icône Material Design pour 'person' */
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
}
.q-toggle__inner.q-toggle__inner--left-label.q-toggle__inner--checked::before { /* Icône pour '2 enfants' si nécessaire */
  content: '\F30F'; /* Icône par défaut, à ajuster si différent */
}
.q-toggle__inner::after { /* Pour 'Année complète' */
  content: '\F4CB'; /* Ceci est une icône Material Design pour 'calendar_today' */
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
  border-radius: 10px; /* Plus arrondi */
  background-color: #e8f5e9;
}

/* Style pour le q-knob répétition */
.q-knob__value.absolute-center.text-h4 {
  font-weight: bold;
}
</style>
