<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container  class="fixed-center vertical-middle">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>


import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout'
})
</script>
