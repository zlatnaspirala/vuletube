
import Vue from 'vue'
import Vuex from 'vuex'

interface ApplicationStateI {
  count: number
  appYtResultItems: Object
}

Vue.use(Vuex)

const state = {
  count: 0,
  appYtResultItems: Object
}

const mutations = {
  increment (state: ApplicationStateI) {
    state.count++
  },
  saveResponse(state: ApplicationStateI, { items }) {
    console.log("Coliano ..............")
    state.appYtResultItems = items
  }
}

export default new Vuex.Store({
  state,
  mutations
})

