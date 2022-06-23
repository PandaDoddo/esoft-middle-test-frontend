import { api } from 'boot/axios'


export function login({ commit }, payload) {
   return api.post('clients/web/login', payload).then(token => {
     commit('loginMutation', { ...token.data, ...payload })
       // .then(() => dispatch('authAction'))
   })
}

export function logoutAction ({ commit }) {
  return commit('logoutMutation');
}

