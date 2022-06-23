import { Cookies } from 'quasar'

export function loginMutation (state, payload) {
  state.token = payload.access_token || false
  if (state.token) Cookies.set('token', state.token, { expires: payload.expires_in ?? null })
  return this.$router.push({ name: 'index' })
}

export function logoutMutation (state) {
  state.token = null
  Cookies.remove('token')
  // this.$router.push({ path: '/login' })
}
