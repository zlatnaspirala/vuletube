
import Vue from 'vue'
import Vuex from 'vuex'

interface ApplicationStateI {
  count: number
  appYtResultItems: Object
  permission: Object
}

Vue.use(Vuex)

/**
 * @description I will use store like global app config file.
 * Global easy access make perfect for that kind of job.
 * Bad aspect: component becomes dependent on store.
 * I will handle this situation to be first ask for data but
 * option, if no store data componnet will use own default values.
 */
const state = {
  count: 0,
  appYtResultItems: {},
  permission: {
    read: "https://www.googleapis.com/auth/youtube.readonly",
    write: "https://www.googleapis.com/auth/youtube.force-ssl"
  }
}

const mutations = {
  increment (state: ApplicationStateI) {
    state.count++
  },
  saveResponse(state: ApplicationStateI, { items }) {
    console.log("Application instance store call saveResponse method.", items)
    state.appYtResultItems = items
  }
}

export default new Vuex.Store({
  state,
  mutations
})

