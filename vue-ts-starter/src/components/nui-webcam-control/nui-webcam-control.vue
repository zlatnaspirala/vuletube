
<template>

  <div ref="nuicontainer"  v-bind:style="nuiCommanderStyle" >
    <div id="container" ref="container" class="content myshadows">
        <video id="webcam" autoplay width="640" height="480" style="display: none;" ></video>
        <canvas id="canvas-source" width="640" height="480" style="bottom: 0;"></canvas>
        <canvas id="canvas-blended" width="640" height="480" style="display: none;"></canvas>
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
  import { switchTheme } from '../../my-common/common-func'

  const CompProps = Vue.extend({
    props: {
      // textContent: String
    }
  });

  // Register for components
  @Component({
    components: {}
  })

  @Component
  export default class nuiCommander extends CompProps {

    declare window : Window | any
    declare operations: {} | any;

    private vc: VoiceCommander = new VoiceCommander()

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
      }

      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/helper.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/system/buffer-load.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/canvasEngine.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/controller.js")

    }

    mounted(): void {

      var root = this as nuiCommander

      setTimeout(function () {

        var browser =  new root.window.detectBrowser()
        root.window.app.drawer = new root.window.canvasEngine(root.window.interActionController)
        root.window.app.drawer.draw()
        root.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/main-function-menu.js")
        root.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/nui-button.js")
        root.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/nui-msg-box.js",
        function() {
          root.attachMainNuiControls()
        })
        console.log("Nui commander is constructed.", browser);

      }, 250)

    }

    asyncLoad(path, callback?) {

      if (typeof callback === "undefined") {
        callback =  function () {}
      }

      var nuiScript = document.createElement("script")
      nuiScript.src = path
      document.head.appendChild(nuiScript)
      nuiScript.onload = function () {
        callback()
      }
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

            console.log("Good")
            root.defineNuiActionController()
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
            alert("Ok good buy.")
            window.location.href = "https://google.com"
          }

        }))

      console.log("nui-commander controls attached.")

      // Register for nui-voice operations
      // this.operations.switchTheme()

    }

    defineNuiActionController = () => {

      var root = this
      var actions = this.window.interActionController
      var indicators = this.window.indicatorsBlocks

      indicators.text[0] = "VOICE"
      actions.main[0].onAction = function() {
        root.vc.run()
      }

      indicators.text[1] = "THEME"
      actions.main[1].onAction = function() {
        root.operations.switchTheme()
      }

      var commanderIconField0 = new Image();
      commanderIconField0.src = "/assets/icons/svgs/solid/file-audio.svg";
      commanderIconField0.onload = function () {
        indicators.icons[0] = this
      }

      var commanderIconField = new Image();
      commanderIconField.src = "/assets/icons/svgs/brands/superpowers.svg";
      commanderIconField.onload = function () {
        indicators.icons[1] = this
      }

    }

  }
</script>
