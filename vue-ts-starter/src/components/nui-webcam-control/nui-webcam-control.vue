
<template>
  <div ref="nuicontainer"  v-bind:style="nuiCommanderStyle" >

    <div id="container">
      <div id="content">
        <video id="webcam" autoplay width="640" height="480"></video>
        <canvas id="canvas-source" width="640" height="480"></canvas>
        <canvas id="canvas-blended" width="640" height="480" style="display: none;"></canvas>
        <div id="xylo"></div>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .myshadows {
    -webkit-box-shadow: 1px 1px 3px 3px rgba(0,0,0,0.5);
    -moz-box-shadow: 2px 2px 3px 3px rgba(0,0,0,0.5);
    box-shadow: 2px 2px 3px 3px rgba(0,0,0,0.5);
  }
</style>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {
  /*mdTabs,
    mdTab,
    mdButton,
    mdDialogActions,
    mdContent*/
   }  from 'vue-material'

  const CompProps = Vue.extend({
    props: {
      // textContent: String
    }
  });

  // Register for components
  @Component({
    components: {
      /*mdButton,
      mdTabs,
      mdTab,
      mdDialogActions,
      mdContent*/
    }
  })

  @Component
  export default class nuiCommander extends CompProps {

    declare window : Window | any

    private nuiCommanderStyle = {
      position: "absolute",
      right: 0,
      top: 0
    }

    constructor() {
      super()

      this.window = window;

      this.window.app = {}

      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/helper.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/system/buffer-load.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/canvasEngine.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/controller.js")

    }

    mounted (): void {

      var root = this as nuiCommander

      setTimeout(function () {

        var browser =  new root.window.detectBrowser()
        root.window.app.drawer = new root.window.canvasEngine(root.window.interActionController)
        root.window.app.drawer.draw()
        root.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/controls/main-function-menu.js")
        console.log("Nui commander is constructed.", browser);

      }, 1000)

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

  }
</script>
