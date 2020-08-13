
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
    z-index:1210;
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
    components: {}
  })

  @Component
  export default class nuiCommander extends CompProps {

    declare window : Window | any

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

      this.window = window;
      this.window.app = {}

      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/helper.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/system/buffer-load.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/scripts/canvasEngine.js")
      this.asyncLoad("/submodules/nui-commander/nui-commander/source/controller.js")

    }

    mounted(): void {

      var root = this as nuiCommander

      // (this.$refs.container as HTMLElement).style.left = "0";

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

    private attachMainNuiControls() {

       var root = this
      // test
      console.log("NUI ATTACH");

     this.window.app.drawer.elements.push(
      new this.window.nuiMsgBox(
        "Do you love this project?",
        function (answer) {
          console.log(answer)
          root.window.app.drawer.removeElementByName("nuiMsgBox")
          if (answer == "yes") {
            alert("Good")
          } else {
            alert("Ok good buy.")
            window.location.href = "https://google.com"
          }
        }))


    }

  }
</script>
