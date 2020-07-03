import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App, {
     props: { error: 'You can not search for assets...' }
  }),
}).$mount('#error')
