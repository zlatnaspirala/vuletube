
<template>

  <div ref="nuicontainer"  v-bind:style="nuiCommanderStyle" v-show='nuiVisibility'>
    <div id="content" ref="container" class="content myshadows">
        <video id="webcam" autoplay width="640" height="480" style="display: none;" ></video>
        <canvas id="canvas-source" width="640" height="480" style="bottom: 0;"></canvas>
        <canvas id="canvas-blended" width="640" height="480" style="display: none;"></canvas>

        <!-- opencvjs starter dom staff start -->
        <div id="vp-debug" v-bind:style="{ 'display': 'none'}" ></div>
        <div ref="videoProcessingStatus" class="text-center">
          <span>Current Filter: </span><span id="filterName">Pass Through</span>
        </div>
        <div id="guiContainer" ref="guiContainer"></div>
        <!-- opencvjs starter dom staff end-->

        <div id="xylo"></div>
    </div>
  </div>

</template>

<style scoped>

  .myshadows {
    -webkit-box-shadow: 1px 1px 3px 3px rgba(0,0,0,0.5);
    -moz-box-shadow: 2px 2px 3px 3px rgba(0,0,0,0.5);
    box-shadow: 2px 2px 3px 3px rgba(0,0,0,0.5);
  }

  .content {
    position: absolute;
    left: 0;
    bottom: 0;
    overflow: hidden;
    z-index:1000;
    background-color: black;
    color: lime;
  }

  #xylo {
    display: none;
    z-index: -1;
    opacity: 0.1;
  }

</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { VoiceCommander } from '../../../public/submodules/voice-commander/voice-commander/src/vanilla-javascript-ecma6/voice-commander'
  import { switchTheme, asyncLoad } from '../../my-common/common-func'
  import myHeader from '../myHeader.vue';
  import myYouTube from '../youtube-3d/myYouTube.vue'
  import App from '../../App.vue';

  const CompProps = Vue.extend({
    props: {
      // textContent: String
    }
  });

  // Register for components
  @Component({
    components: {
      myHeader,
      myYouTube,
      App
    }
  })

  @Component
  export default class nuiCommander extends CompProps {

    declare window : Window | any
    declare operations: {} | any;

    private webcamVideo: HTMLVideoElement | null = null;

    private vcOptions = {

      callback: (r) => {

        var root = this

        var getArrayList = r.split(' ')
        console.info('Voice list length-> ' + getArrayList.length +
                     '\n \n Command word => ' , getArrayList[0] +
                     '\n \n next => ' , getArrayList[1])

        /**
         * @description Command word is =>
         *                `search` , `search for`
         */
        if (getArrayList.length > 1) {

          if (getArrayList[0] === 'search' ||
              getArrayList[0] === 'search' && getArrayList[1] === 'for') {

            let searchText: string = '';
            getArrayList.forEach((element, index) => {
              if (index !== 0) {
                searchText += element + ' '
              }
            });
            // command
            (root.$root.$children[0].$children[2] as myYouTube).$data.yts.mySearchQuery = searchText
            console.info("searchText => ", searchText);
            (root.$root.$children[0].$children[2] as myYouTube).execute()

          }

        } else if (getArrayList.length === 1) {

          // Direct command
          if (getArrayList[0] === 'theme' || getArrayList[0] === 'switch') {
             (root.$root.$children[0].$children[0] as myHeader).switchTheme()
          }
          console.log('getArrayList.length is ', getArrayList.length)
        } else {
          console.info('getArrayList.length =>', getArrayList.length )
        }

      }

    }

    private vc: VoiceCommander = new VoiceCommander(this.vcOptions)
    private nuiVisibility: boolean = true
    private nuiCommanderStyle = {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "320px",
      height: "320px",
      zIndex: 10000
    }

    constructor() {
      super()

      this.window = window
      this.window.app = {}

      this.operations = {
        switchTheme: switchTheme.bind(this)
        // // showAboutDialogClick()
      }

      asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/helper.js")
      asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/system/buffer-load.js")
      asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/canvasEngine.js")
      asyncLoad("/submodules/nui-commander/nui-commander/source/controller.js")

    }

    mounted(): void {

      var root = this as nuiCommander

      this.webcamVideo = document.getElementById("webcam") as HTMLVideoElement

      setTimeout(function () {

        var browser =  new root.window.detectBrowser()
        root.window.app.drawer = new root.window.canvasEngine(root.window.interActionController)
        root.window.app.drawer.draw()
        asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/main-function-menu.js")
        asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/nui-button.js")
        asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/nui-msg-box.js", function() {
            root.attachMainNuiControls()
          })
        console.log("Nui commander is constructed.", browser);

        root.$root.$on('nuiVisibilityOptionsChanged',  function(this: typeof Vue, args: any) {
          try {
            console.info("Event nuiVisibilityOptionsChanged => ", args)
            root.nuiVisibility = args.nuiVisibility
            root.window.app.drawer.systemOnPause = !args.nuiVisibility
            if (root.window.app.drawer.systemOnPause === false) {
              root.window.app.drawer.update()
            }
            console.log(root.window.app.drawer.systemOnPause)
          } catch(err) {
            console.warn(err)
          }
        })

      }, 500)

    }

    created() {

      this.$root.$on('privateCameraOff', (s: typeof Vue, args: any) => {
        try {

           console.info("Event privateCameraOff => ", args);
           (this.$refs.videoProcessingStatus as HTMLElement).style.display = 'none';
           (this.$refs.guiContainer as HTMLElement).style.display = 'none'

        } catch(err) {
          console.warn(err)
        }
      })

      this.$root.$on('privateCameraOn', (s: typeof Vue, args: any) => {
        try {

           console.info("Event privateCameraOn => ", args);
           (this.$refs.videoProcessingStatus as HTMLElement).style.display = 'block';
           (this.$refs.guiContainer as HTMLElement).style.display = 'block'

        } catch(err) {
          console.warn(err)
        }
      })


    }

    private attachMainNuiControls() {

      var root = this

      this.window.app.drawer.elements.push(
       new this.window.nuiMsgBox(
        "Do you love this project?",
        function (answer) {

          console.log(answer)
          root.window.app.drawer.removeElementByName("nuiMsgBox")

          if (answer == "yes") {

            console.log("Good answer is yes.")
            root.defineNuiActionController()
            root.defineVoiceActionController()
            setTimeout( () => {
              root.window.app.drawer.elements.push(
              new root.window.nuiMsgBox(
                "Do you wanna to activate voice commander?",
                function (answer) {
                  root.window.app.drawer.removeElementByName("nuiMsgBox")
                  if (answer == "yes") {
                    root.vc.run()
                  }
                }))
            }, 800)

          } else {
            console.log("Ok good buy.")
            window.location.href = "https://google.com"
          }

        }))

      console.info("nui-commander controls attached.")
    }

    defineNuiActionController = () => {

      var root = this
      var actions = this.window.interActionController
      var indicators = this.window.indicatorsBlocks

      indicators.text[0] = "VOICE"
      actions.main[0].onAction = function() {
        if (actions.main[1].status == false) {
          root.vc.run()
        }
      }

      indicators.text[8] = "THEME"
      actions.main[1].onAction = function() {
        root.operations.switchTheme()
      }

      indicators.text[16] = "LOGIN"
      actions.main[2].onAction = function() {
        root.$root.$emit('googleApiLoginEvent', { start: 'start googleApiLoginEvent' })
      }

      indicators.text[24] = "SpinPlaces"
      actions.main[3].onAction = function() {
        (root.$root.$children[0] as App).switchPlaceAction()
      }

      // About
      indicators.text[56] = "ABOUT"
      actions.main[7].onAction = function() {
        (root.$root.$children[0].$children[0] as myHeader).showAboutDialogClick()
      }

      // logo for vuletube
      indicators.text[63] = "VULETUBE"
      actions.main[63].onAction = function() {
      }

      var commanderIconField0 = new Image()
      commanderIconField0.src = "/assets/icons/svgs/solid/file-audio.svg"
      commanderIconField0.onload = function () {
        indicators.icons[0] = this
      }

      var commanderIconField1 = new Image()
      commanderIconField1.src = "/assets/icons/svgs/solid/th-large.svg"
      commanderIconField1.onload = function () {
        indicators.icons[1] = this
      }

      var commanderIconField2 = new Image()
      commanderIconField2.src = "/assets/icons/svgs/solid/key.svg"
      commanderIconField2.onload = function () {
        indicators.icons[2] = this
      }

      var commanderIconField3 = new Image()
      commanderIconField3.src = "/assets/icons/svgs/brands/superpowers.svg"
      commanderIconField3.onload = function () {
        indicators.icons[3] = this
      }

      var commanderIconField7 = new Image()
      commanderIconField7.src = "/assets/icons/pngs/information.png"
      commanderIconField7.onload = function () {
        indicators.icons[7] = this
      }

    }

    defineVoiceActionController = () => {

      // var root = this
      console.log('defineVoiceActionCOntroller =>')


    }

  }
</script>
