<template>
  <!-- App.vue: On conserve le q-layout global MAIS le header sera UNIQUEMENT dans IndexPage.vue -->
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Ce fichier App.vue ne contient PAS le header. Le header est DANS IndexPage.vue.
</script>
