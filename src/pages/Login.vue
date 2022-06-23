<template>
  <q-page class="flex flex-center">
    <q-form @submit="send">
      <q-card class="q-pa-md"  style="max-width: 440px; width: 100vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Логин</div>
          <q-space/>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="login"
            type="text"
            lazy-rules
            label="Логин"
            :rules="[val => val && val.length > 0 || 'Поле обязательно для заполнения']"
            :error="!!login_data"
            :error-message='login_data'
          />
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Пароль"
            :rules="[val => val && val.length > 0 || 'Поле обязательно для заполнения']"
            lazy-rules
            :error="!!password_data"
            :error-message='password_data'
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-btn
            class="full-width"
            color="primary"
            :loading="loader"
            label="Логин"
            type="submit"
            size="md"
          />
        </q-card-section>
      </q-card>
    </q-form>

  </q-page>

</template>

<script>

export default {
  name: 'PageAuthLogin',
  components: {},
  data() {
    return {
      loader: false,
      login: null,
      login_data: null,
      password: null,
      password_data: null,
      isPwd: true,
      remember: false
    }
  },
  methods: {
    async send() {
      this.loader = true
      this.$store.dispatch('auth/login', {
        login: this.login,
        password: this.password
      })
        .then(() => {
          this.loader = false
        })
        .catch(error => {
          this.loader = false;

          this.login_data = error.response.data.errors.length === 0 ? error.response.data.message : null;

          this.login_data = error.response.data.errors.login[0] || error.response.data.message
          this.password_data = error.response.data.errors.password[0] || error.response.data.message
        })
    }
  }
}
</script>
