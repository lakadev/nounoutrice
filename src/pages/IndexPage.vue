<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Plages horaires -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Plages horaires</div>
          </q-card-section>
          <q-card-section>
            <div v-for="(plage, index) in store.plages" :key="index" class="row q-col-gutter-sm q-mb-md">
              <div class="col-3">
                <q-input v-model.number="plage.debut" type="number" label="Début" outlined dense />
              </div>
              <div class="col-3">
                <q-input v-model.number="plage.fin" type="number" label="Fin" outlined dense />
              </div>
              <div class="col-3">
                <q-input v-model.number="plage.repetition" type="number" label="Jours/semaine" outlined dense />
              </div>
              <div class="col-3">
                <q-btn color="negative" icon="remove" flat @click="store.removePlage(index)" :disable="store.plages.length <= 1" />
              </div>
            </div>
            <q-btn color="primary" icon="add" label="Ajouter plage" @click="store.addPlage" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Tarif -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Tarif horaire net</div>
            <q-slider v-model="store.tarif" :min="0" :max="20" :step="0.5" label label-always class="q-mt-md" />
            <div class="text-center text-h5">{{ store.tarifFormated }} €/h</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Options -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-toggle v-model="store.deuxEnfants" label="2 enfants" />
            <q-toggle v-model="store.anneeComplete" label="Année complète" />
            <q-slider v-if="!store.anneeComplete" v-model="store.semainesIncomplete" :min="1" :max="52" label label-always class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Résultats -->
      <div class="col-12">
        <q-card class="bg-green-1">
          <q-card-section>
            <div class="text-h5">Total semaine : <strong>{{ store.totalHeuresSemaine }}h</strong></div>
            <div class="text-h6 q-mt-md">Tarif net : {{ store.tarifFormated }} €/h</div>
            <div class="text-h4">Coût mensuel : ~{{ store.totalMensuel }} €/mois</div>
            <div class="text-body1" v-if="store.heuresSup > 0">
              dont ~{{ store.heuresSup }}h à {{ store.tarifHeuresSup.toFixed(2) }}€/h
            </div>
            <div class="text-body1">+ {{ store.indemniteMensuelle }}€ d'indemnités</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useNounoutriceStore } from '../stores/nounoutrice'
const store = useNounoutriceStore()
</script>
