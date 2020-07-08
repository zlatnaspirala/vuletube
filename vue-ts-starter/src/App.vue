
<template>
  <div id="app">
    <myHeader slogan='Welcome to the vue-project-generator.'></myHeader>
    <myYouTube ref="myYouTube" ></myYouTube>
    <myFooter textContent='https://maximumroulette.com:3000 VueTube web service 2020'></myFooter>
  </div>
</template>

<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import myHeader from './components/myHeader.vue'
  import myFooter from './components/myFooter.vue'
  import { mapState, mapMutations } from 'vuex'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  // import 'vue-material/dist/theme/black-green-dark.css'
  import './styles/style.scss'

  // Current component dev => myYouTube
  import myYouTube from './components/myYouTube.vue'

  Vue.use(VueMaterial as any)

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
      myFooter,
      myYouTube
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
      myYouTube: myYouTube
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
  }
</style>
