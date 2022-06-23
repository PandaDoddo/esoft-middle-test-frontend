<template>
  <q-page class="flex flex-center">
    <!--
  Forked from:
  https://quasar.dev/vue-components/form#example--basic
-->
    <div id="q-app">
      <div class="q-pa-md" style="max-width: 400px">
        <q-form
          @submit="sendForm"
          class="q-gutter-md"
        >
          <h5>Registration</h5>
          <q-input
            filled
            v-model="email"
            label="Your name *"
            hint="Name and surname"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          ></q-input>

          <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              ></q-icon>
            </template>
          </q-input>

          <q-input v-model="password_confirmation" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              ></q-icon>
            </template>
          </q-input>

          <q-toggle v-model="accept" label="I accept the license and terms"></q-toggle>

          <div>
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
          </div>
        </q-form>

      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from "boot/axios";

export default defineComponent({
  name: 'PageAuthRegistration',
  data() {
    return {
      isPwd: true,
      email: null,
      password: null,
      password_confirmation: null,
      accept: false
    }
  },
  created() {
    api.get('/sanctum/csrf-cookie/').then(( data ) => {
      console.log(data);
    });
  },
  methods: {
    sendForm() {
     api.get('/sanctum/csrf-cookie/').then( () => {
       api.post('/register/', this.data).then(( data ) => {
         console.log(data);
       });
     });
    }
  }
})
</script>
