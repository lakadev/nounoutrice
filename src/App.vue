<template>
  <q-layout view="hHh lpR fFf">
    <!-- Le q-layout global est conservé, mais le header sera géré UNIQUEMENT par IndexPage.vue -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Ce fichier App.vue ne gère PAS le header. Le header est DANS IndexPage.vue.
</script>
