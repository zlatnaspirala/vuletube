
<template>
  <div id="app">

    <myHeader slogan='Be good.'></myHeader>
    <GoogleAccountLogin ref="GoogleAccountLoginRef" ></GoogleAccountLogin>

  </div>
</template>

<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import myHeader from './components/myHeader.vue'
  import GoogleAccountLogin from './components/GoogleAccountLogin.vue'

  import { mapState, mapMutations } from 'vuex'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  import 'vue-material/dist/theme/black-green-dark.css'
  Vue.use(VueMaterial as any)

  import './styles/style.scss'

  /**
   *  We declare the props separately
   *  to make props types inferable.
   */
  const AppProps = Vue.extend({
    props: {
      AppPropVersion: String
    }
  });

  // Register for components
  @Component({
    components: {
      myHeader,
      GoogleAccountLogin
    },
    // Vuex's component binding helper can use here
    computed: mapState([
      'count'
    ]),
    methods: mapMutations([
      'increment'
    ])
  })

  export default class App extends AppProps {

    // annotate refs type
    $refs!: {
      myHeader: myHeader,
      GoogleAccountLogin: GoogleAccountLogin
    }

    // additional declaration is needed
    // when you declare some properties in `Component` decorator
    count!: number
    increment!: () => void

    // method
    setupInstance (): void {
      console.log('Attach Application event => ')
       // var root1 = this
      // this.$refs.myHeader.sayHello()

    }

    // computed
    get computedMsg (): string {
      return 'computed '
    }

    // lifecycle hook
    mounted (): void {
      this.setupInstance()
    }


  }

</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 60px;
  }
</style>
