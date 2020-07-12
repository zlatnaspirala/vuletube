
<template>
  <div id="app">
    <myHeader slogan='Welcome to the vue-project-generator.'></myHeader>
    <div v-bind:style="styleObject">
      <myYouTube ref="myYouTube" ></myYouTube>
      <threejsYoutubePlayer ref="myYouTubeThreejs" ></threejsYoutubePlayer>
    </div>
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
  import './styles/style.scss'

  // Current component dev => myYouTube
  import myYouTube from './components/youtube-3d/myYouTube.vue'
  import threejsYoutubePlayer from './components/youtube-3d/webgl-player.vue'

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
      myYouTube,
      threejsYoutubePlayer
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

    // Annotate refs type
    $refs!: {
      myHeader: myHeader,
      myYouTube: myYouTube
    }

    // Additional declaration is needed.
    // When you declare some properties in `Component` decorator.
    count!: number
    increment!: () => void

    private styleObject;

    constructor() {
      super()

      this.styleObject = {
        display: 'flex',
        //alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        itemsAlign: 'center',
        height: '100%',
        width: '100%',
        border: 'solid red 1px'
      }

    }

    setupInstance = () => {
      console.log('Attach Application event => ')
    }

    // computed
    get computedMsg (): string {
      return 'computed'
    }

    // lifecycle hook
    mounted (): void {
      this.setupInstance()
    }


  }

</script>

<style>

  body {
     overflow: hidden;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
