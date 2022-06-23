import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({ baseURL: process.env.API_BASE_URL, withCredentials: true })

export default boot(async ({ app, store , router}) => {
  api.interceptors.request.use(request => {

    const token = store.getters['auth/tokenGetter']
    if (token) request.headers.common['Authorization'] = `Bearer ${token}`

    return request
  })

  api.interceptors.response.use(response => response, error => {
    const { status } = error.response

    console.log(error.response)

    if (status === 401) {
      Notify.create({ type: 'negative', position: 'center' ,message: 'Вы не авторизованы!' })
      store.dispatch('auth/logoutAction').then(() => {
        router.push({ path: '/login' })
        //   .then(() => notifyAction({
        //   message: $t('token_expired_alert_title')+' '+status
        // }))
      })
    }


    if (status >= 500) {
      Notify.create({ type: 'negative', position: 'center' ,message: 'Что то пошло не так, перезагрузите страницу!' })
    }

    return Promise.reject(error)
  }) // Response interceptor

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
