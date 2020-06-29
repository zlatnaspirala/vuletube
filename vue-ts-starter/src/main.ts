import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App, {
     props: { AppPropVersion: '0.0.1' }
  }),
}).$mount('#app')
