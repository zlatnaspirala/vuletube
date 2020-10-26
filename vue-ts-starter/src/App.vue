
<template>
  <div id="app">
    <myHeader slogan='VuleTube application' v-bind:switchPlaceA="this.switchPlaceAction" ></myHeader>
    <div ref="mybodycontent" v-bind:style="styleObject">

      <div class="loader" ref="loader" style="display: block;">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

      <myYouTube v-if="switchPlace" ref="myYouTube" :arg="{ options: this.options }" ></myYouTube>
      <threejsYoutubePlayer v-else ref="myYouTubeThreejs" :arg="{ options: 'optimal' }" ></threejsYoutubePlayer>

      <threejsYoutubePlayer v-if="switchPlace" ref="myYouTubeThreejs" :arg="{ options: 'optimal' }" ></threejsYoutubePlayer>
      <myYouTube v-else ref="myYouTube" :arg="{ options: this.options }" ></myYouTube>

      <nuiCommander></nuiCommander>

    </div>
    <myFooter textContent='https://maximumroulette.com:3000 VuleTube web service 2020'></myFooter>
  </div>
</template>

<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import myHeader from './components/myHeader.vue'
  import myFooter from './components/myFooter.vue'
  import nuiCommander from './components/nui-webcam-control/nui-webcam-control.vue'
  import { mapState, mapMutations } from 'vuex'
  // eslint-disable-line no-unused-vars
  import IApp from './IApp'
  import myYouTube from './components/youtube-3d/myYouTube.vue'
  import threejsYoutubePlayer from './components/youtube-3d/webgl-player.vue'
  import LocalStorageMemory from './local-storage/local-storage'

  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  import './styles/style.scss'
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
      threejsYoutubePlayer,
      nuiCommander
    },
    // Vuex's component binding helper can use here
    computed: mapState([
      'count',
      'appYtResultItems',
      'permission'
    ]),
    methods: mapMutations([
      'increment',
      'saveResponse'
    ])
  })

  export default class App extends AppProps {

    /**
     * @description  Annotate refs type
     * typescript addition.
     */
    $refs!: {
      myHeader: myHeader,
      myYouTube: myYouTube,
      mybodycontent: HTMLDivElement,
      loader: HTMLDivElement
    }

    /**
     * @description `ls` is instance for localstorage operation
     * I will use it like singletone for injection in places
     * where is needed.
     */
    public ls: LocalStorageMemory = new LocalStorageMemory()

    /**
     * @description Additional declaration is needed.
     * When you declare some properties in `Component` decorator.
     * count!: number
     * increment!: () => void
     */
    count!: number
    increment!: () => void
    saveResponse!: () => void
    permission!: Object

    public styleObject;

    /**
     * @description options are main object
     * for user in fly setup. If user clear
     * cache memory(localStorege) everything
     * goes back to the default values.
     */
    public options: Object = {}

    /**
     * Switch place of two main components.
     * Youtube & webGLPlayer
     * Better to remove from here ...
     */
    public switchPlace: boolean = false
    public currentRoute

    /**
     * @description Initial method construct.
     */
    constructor() {
      super()

      this.styleObject = {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        itemsAlign: 'center',
        height: '100%',
        width: '100%'
      }

      /**
       * @description  Check page localStorage
       * Note: Only lower chars for naming ls objects.
       */
      if (this.ls.load("first_time") === null) {

        console.info("App starts first time. Prepare storage data...")

        /**
         * In future enumerate for global config...
         */
        this.ls.save("o_camera", false)
        this.ls.save("o_searchbox_width", '25')
        this.ls.save("o_searchbox_visibility_channel_title", false)
        this.ls.save("o_searchbox_visibility_title", true)
        this.ls.save("o_searchbox_visibility_videoid", false)
        this.ls.save("o_searchbox_visibility_thumbnails", true)
        this.ls.save("o_nui_visibility", true)

        /**
         * @description Permission staff
         * Cant be read or write
         */
        this.ls.save("permission_level", "read")

        // For threejs
        this.ls.save("o_switch_place", true)
        this.ls.save("o_webglbox_camera_z", 5.5)
        this.ls.save("o_webglbox_background_r", "100")
        this.ls.save("o_webglbox_background_g", "100")
        this.ls.save("o_webglbox_background_b", "100")
        this.ls.save("o_webglbox_search_results_preview", true)
        this.ls.save("o_webglbox_preview_per_page", 20)
        this.ls.save("o_webglbox_opencv_starter_for_camera", true)

        this.options = {
          permissionLevel: this.ls.load("permission_level"),
          searchBox: {
            width: this.ls.load("o_searchbox_width"),
            visibilityChannelTitle:  this.ls.load("o_searchbox_visibility_channel_title"),
            visibilityTitle:  this.ls.load("o_searchbox_visibility_title"),
            visibilityVideoId:  this.ls.load("o_searchbox_visibility_videoid"),
            visibilityThumbnails:  this.ls.load("o_searchbox_visibility_thumbnails"),
          },
          nuiVisibility: this.ls.load("o_nui_visibility"),
        };

        this.ls.save("first_time", 'storage-loaded')

      } else {

        console.info("App loading storage data...")
        this.options = {
          permissionLevel: this.ls.load("permission_level"),
          searchBox: {
            width: this.ls.load("o_searchbox_width"),
            visibilityChannelTitle:  this.ls.load("o_searchbox_visibility_channel_title"),
            visibilityTitle:  this.ls.load("o_searchbox_visibility_title"),
            visibilityVideoId:  this.ls.load("o_searchbox_visibility_videoid"),
            visibilityThumbnails:  this.ls.load("o_searchbox_visibility_thumbnails"),
          },
          nuiVisibility: this.ls.load("o_nui_visibility"),
        }
      }


      this.$root.$on('gapiReady', (args: any) => {

        try {
          console.info("Event gapiReady => ", args)
          this.$refs.loader.style.display = 'none'
        } catch(err) {
          console.warn(err)
        }

      })

    }

    setupInstance = () => {
      this.currentRoute = window.location.pathname
      // console.log('Test Application refs mybodycontent => ', this.$refs.mybodycontent)
      // console.log('Attach Application event this.currentRoute => ', this.currentRoute)
    }

    public switchPlaceAction() {
      this.switchPlace = !this.switchPlace
      this.ls.save("o_switch_place", this.switchPlace)
    }

    get computedMsg (): string {
      return 'computed'
    }

    mounted (): void {
      this.setupInstance()
      this.switchPlace = this.ls.load("o_switch_place")
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

  .loader {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: black;
    z-index: 99999;
    text-align: center;
    /* justify-items: center; */
    /* align-items: center; */
    /* align-self: center; */
    /* vertical-align: middle; */
    margin: 0;
    padding: 10%;
  }

</style>
