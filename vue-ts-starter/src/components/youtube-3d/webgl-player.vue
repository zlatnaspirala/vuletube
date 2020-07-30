
<template>
  <div v-bind:style="styleObject">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>3D VIEW OPTIONS</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="GENERAL">
          <md-content class="md-scrollbar">
            <md-field>
              <label>CAMERA DEEP: {{ this.camera.position.z }}</label>
                <md-input v-bind:value="this.camera.position.z"
                      v-on:input="setCameraDeepByZ"
                      type="range">
                </md-input>
              </md-field>
          <md-field>
            <label>PREVIEW PER PAGE: {{ this.previewPerPage }}</label>
              <md-input min="10" max="50" step="10" v-bind:value="this.previewPerPage"
                v-on:input="previewPerPageChanged" type="range">
            </md-input>
          </md-field>

            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="searchResultPreviewOptionsChanged" class="md-primary md-raised"
                v-model="optionsSearchResultPreview">Visibility of results in 3d env.</md-switch>
            </md-content>
          </md-content>
        </md-tab>

        <md-tab md-label="Background">
          <md-content>
            <h3>BACKGROUND:</h3>
              <md-field >
              <label>Red component: </label>
                <md-input min="0" max="255" ref="redcomponent" v-bind:value="this.oBackground.r"
                  v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Green component: </label>
                <md-input min="0" max="255" ref="greencomponent" v-bind:value="this.oBackground.g"
                          v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Blue component: </label>
                <md-input min="0" max="255" ref="bluecomponent" v-bind:value="this.oBackground.b"
                      v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>
            </md-content>
        </md-tab>

      </md-tabs>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Texture video tag  @timeupdate='updateCurrentTime'-->
    <video ref="texvideo"
           v-bind:style="{ display: 'none',
                          position: 'absolute',
                          top: '-1000px' }"
           autoplay
           playsinline ></video>

    <!-- WebCam texture video tag -->
    <video ref="webcam" v-bind:style="{ display: 'none' }" autoplay playsinline></video>

    <md-field class="menubox">
      <md-button class="md-primary md-raised" @click="showDialog = true">
        <md-icon class="fa fa-cog"></md-icon>
      </md-button>
      <md-button class="md-primary md-raised" @click="$refs.texvideo.play()">
        <md-icon class="fa fa-play"></md-icon>
      </md-button>
      <md-button class="md-primary md-raised" @click="$refs.texvideo.pause()">
        <md-icon class="fa fa-pause"></md-icon>
      </md-button>

      <!-- v-bind:value="localCurrentTime" v-on:input="changeCurrentVideoPosition" -->
      <md-field class="currentTimeField" >
        <label>Duration {{ getDuration() }} currentTime {{ localCurrentTime }} </label>
        <md-input step="1" min="0" :max="getDuration()" :value="localCurrentTime"
         type="range">
        </md-input>
      </md-field>

    </md-field>

    <!-- threejs canvas tag -->
    <div class="canvasDom" ref="container"></div>

  </div>
</template>

<style scoped>
  .canvasDom {
    width:100%;
  }

  .md-tab {
    padding: 25px 25px 25px 25px;
  }

  .currentTimeField {
    margin: 4px 0 0;
  }

</style>

<style lang="scss" scoped>
  .md-dialog /deep/.md-dialog-container {
    max-width: 1000px;
  }

  .md-content {
    max-width: 100%;
    max-height: 520px;
    overflow: auto;
  }

  .menubox {
    width: 100%;
    min-height: 45px;
    margin: 1px 0 1px;
    padding-top: 2px;
    display: flex;
    position: relative;
    font-family: inherit;
  }

</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import * as THREE from 'three/build/three.module'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import LocalStorageMemory from '../../local-storage/local-storage';

  import {
    mdTabs,
    mdTab,
    mdInput,
    mdButton,
    mdDialog,
    mdDialogActions,
    mdContent,
    mdField
  }  from 'vue-material'

  const CompProps = Vue.extend({
    props: {
      arg: Object
    }
  });

  // Register for components
  @Component({
    components: {
      mdTabs,
      mdTab,
      mdInput,
      mdButton,
      mdDialog,
      mdDialogActions,
      mdContent,
      mdField
    }
  })

  @Component
  export default class threejsYoutubePlayer extends CompProps {

    declare YT;

    private ls: LocalStorageMemory = new LocalStorageMemory()
    private camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    private scene = new THREE.Scene()
    private renderer = new THREE.WebGLRenderer({ antialias: true })
    private raycaster = new THREE.Raycaster()
    private mouse = new THREE.Vector2()
    private video
    private container
    private texvideo
    private webcamMesh
    private meshGroupSearchResult = new THREE.Object3D()
    private INTERSECTED: any = null
    private lastHoveredElement: any

    private showDialog: boolean = false
    private optionsSearchResultPreview: boolean = false
    private planeAddedToScene: boolean = false
    private previewPerPage: number = 25

    private localCurrentTime: any = null

    private styleObject = {
      width: '100%'
    }

    private optionsStyle = {
      display: 'flex',
      width: '100%',
      paddingBottom: '1px',
      textAlign: 'center',
      itemsAlign: 'left',
      height: '60px',
      paddingLeft: '5px'
    }

    private oBackground = {
      r: 0,
      g: 0,
      b: 0
    }

    // UNRESOLVED VUE LIMITATIONS
    // For audio and video html object cat not be used bind: v-model or any
    // Effect : initialy load value without update, or lag video on @time

    // I will use classic interval
    private runVideoReactor() {
      setInterval(() => {
        this.localCurrentTime = (this.$refs.texvideo as HTMLVideoElement).currentTime.toFixed(2)
      }, 500)
    }

    mounted (): void {

      this.init()
      this.animate()

      this.oBackground.r = this.ls.load("o_webglbox_background_r")
      this.oBackground.g = this.ls.load("o_webglbox_background_g")
      this.oBackground.b = this.ls.load("o_webglbox_background_b")

      this.optionsSearchResultPreview = this.ls.load("o_webglbox_search_results_preview")
      this.previewPerPage = this.ls.load("o_webglbox_preview_per_page")

      this.renderer.setClearColor ("rgb(" +
        this.oBackground.r + "," +
        this.oBackground.g+ "," +
        this.oBackground.b + ")"
      )

      this.runVideoReactor()

    }

    created(): void {

      this.container = this.$refs.container as HTMLElement

      this.$root.$on('reziseCanvas', () => {
       this.setCanvasElementSize()
      });

      this.$root.$on('ytItemsReady', (args) => {

        var testString: string = ''
        var thumbPaths: string[] = []
        // args.items
        args.items.forEach(element => {
          console.log(".....", element.id.videoId)
          testString += ',' + element.id.videoId
          thumbPaths.push(element.id.videoId)
        });

        var testLogic = true

        fetch('/saveThumbnails?imgs=' + testString)
          .then((response) => {

            console.log("saveThumbnails => ", args)
            if (this.optionsSearchResultPreview && testLogic == true) {
               testLogic = false
               this.addSearchResult3dObjects(thumbPaths)
            }

            console.log("response => " + response)
          }).catch(function(err) {
            console.log('Fetch in webgl component: ', err)
        });


      })

      this.$root.$on('videoInProgress', (args: any) => {

        try {
           console.info("Event videoInProgress => ", args)
           setTimeout(() => {
             this.trySource(args)
           }, 5000)

        } catch(err) {
          console.warn(err)
        }

      })

    }

    private rayClickHandler() {

        this.raycaster.setFromCamera( this.mouse, this.camera)
        var intersects = this.raycaster.intersectObjects(this.meshGroupSearchResult.children, true)

     if (intersects.length > 0) {

            this.INTERSECTED = intersects[0].object;
            this.INTERSECTED.material.opacity = 1;
            console.log("Cliked on name ---> " + intersects[0].object.name);
            this.prepareThisVideo(intersects[0].object.name.substring(1))

        } else {

          if (this.INTERSECTED !== null && this.INTERSECTED.material && this.INTERSECTED.material.opacity) {
            try {
              this.INTERSECTED.material.opacity = 1;
            } catch(err) {
              console.log(err)
            }
          }
          this.INTERSECTED = null;

        }
    }

    private previewPerPageChanged(value): void {
      this.previewPerPage = value
      this.ls.save('o_webglbox_preview_per_page', value)
    }

    private searchResultPreviewOptionsChanged(value): void {
      this.ls.save("o_webglbox_search_results_preview", value)
      this.meshGroupSearchResult.visible = value
    }

    private setCameraDeepByZ(currValue: any): void {
      this.camera.position.z = currValue
      this.ls.save("o_webglbox_camera_z", currValue)
    }

  private prepareThisVideo(arg) {

      var passVideoId = arg
      fetch('/dzoni?vid=' + passVideoId)
      .then(
        (response) => {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code:' +
              response.status);
            return;
          }

          console.log("I am look at response", response)
          var handler = response.url.split("?vid=")
          const passArgs = {
            videoId: handler[1]
          }
          this.$root.$emit('videoInProgress', passArgs)
        }
      )
      .catch(function(err) {
        console.error('Fetch Error => ', err);
      });
    }

    private trySource(args: any) {

      console.log("Try source", args)
      try {
        (this.$refs.texvideo as HTMLVideoElement).src = "https://maximumroulette.com:3000/videos/vule" + args.videoId + ".mp4"
        this.$refs.texvideo["style"].display = "block"

        setTimeout(() => {
          this.prepareVideoTexture('plane')
        }, 3000)

        alert("Please wait 5 sec...")

      }catch(err) {
        console.warn("Link is broken...", err)
      }
    }

    private init() {

      this.video = this.$refs.webcam;
      this.camera.position.z = this.ls.load("o_webglbox_camera_z");

      // ORIGINAL var texture = new THREE.VideoTexture( this.video )
      var texture = new THREE.VideoTexture(this.video)
      // var texture = new THREE.TextureLoader().load('assets/vule-logo1.png')

      var geometry = new THREE.PlaneBufferGeometry( 16, 9 );
      geometry.scale(0.5, 0.5, 0.5)
      var material = new THREE.MeshBasicMaterial({ map: texture })

      this.webcamMesh = new THREE.Mesh(geometry, material)
      this.webcamMesh.position.z = -10
      this.webcamMesh.position.x = -7
      this.webcamMesh.position.y = 4.5
      // mesh.lookAt(new THREE.Vector3( 0, 0, 0 ))
      geometry.scale(0.3, 0.3, 0.3);

      // ask
      this.scene.add(this.webcamMesh)
      // ask
      this.scene.add(this.meshGroupSearchResult)

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.858);
      (this.$refs.container as HTMLElement).appendChild(this.renderer.domElement);
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
      // controls.enableZoom = false;
      controls.enablePan = false;

      window.addEventListener('resize', this.onWindowResize, false)
      window.addEventListener('click', this.rayClickHandler, false)
      this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false)

      if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

        var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

        navigator.mediaDevices.getUserMedia( constraints ).then((stream) => {
          // apply the stream to the video element used in the texture
          this.video.srcObject = stream;
          this.video.play();
        } ).catch( function ( error ) {
          console.error( 'Unable to access the camera/webcam.', error );
        } );

      } else {
        console.error('MediaDevices interface not available.')
      }

    }

    private getDuration(): number | any {
      if (typeof this.$refs.texvideo !== 'undefined' &&
          typeof (this.$refs.texvideo as HTMLVideoElement).duration !== 'undefined' &&
          !isNaN((this.$refs.texvideo as HTMLVideoElement).duration)) {
        return (this.$refs.texvideo as HTMLVideoElement).duration
      } else {
        return 0
      }
    }

    private getCurrentTime() {
      if (typeof this.$refs.texvideo !== 'undefined' &&
          typeof (this.$refs.texvideo as HTMLVideoElement).currentTime !== 'undefined' ) {
        return (this.$refs.texvideo as HTMLVideoElement).currentTime
      } else {
        return 0
      }
    }

    private changeCurrentVideoPosition(testValue): void {
      (this.$refs.texvideo as HTMLVideoElement).currentTime = testValue
      // console.log('changeCurrentVideoPosition', testValue)
    }

    private prepareVideoTexture = (visualShape: string) => {

      if(visualShape === "plane") {

        if (this.planeAddedToScene === false) {

          this.texvideo = this.$refs.texvideo
          var texture = new THREE.VideoTexture(this.texvideo)
          var geometry = new THREE.PlaneBufferGeometry(16, 9)
          geometry.scale(1.4, 1, 1)

          var material = new THREE.MeshBasicMaterial({ map: texture })
          var mesh = new THREE.Mesh(geometry, material)
          mesh.position.z = -8
          // mesh.lookAt(this.camera.position)
          this.scene.add(mesh)
          this.planeAddedToScene = true

        }

        try {
          this.texvideo.play()
        } catch(err) {
          console.log(err)
        }

      }

    }

    private setCanvasElementSize = () => {
      if (!this.renderer) {
        console.warn(".....");
        return;
      }
      this.renderer.setSize((this.$refs.container as HTMLElement).clientWidth, window.innerHeight * 0.81);
    }

    private onWindowResize() {
      this.camera.aspect = (this.$refs.container as HTMLElement).clientWidth / (this.$refs.container as HTMLElement).clientHeight
      this.camera.updateProjectionMatrix()
      this.setCanvasElementSize()
    }

    private animate() {

      requestAnimationFrame(this.animate)

        this.raycaster.setFromCamera( this.mouse, this.camera)
        var intersects = this.raycaster.intersectObjects(this.meshGroupSearchResult.children, true)

     if (intersects.length > 0) {

          if (this.INTERSECTED != intersects[0].object) {

            if (typeof this.lastHoveredElement !== 'undefined') {
              this.lastHoveredElement.material.opacity = 1;
            }

            this.INTERSECTED = intersects[0].object;
            this.INTERSECTED.material.opacity = 0.75;
            this.lastHoveredElement = intersects[0].object;

          }

        } else {

          if (typeof this.lastHoveredElement !== 'undefined' && this.lastHoveredElement.material && this.lastHoveredElement.material.opacity) {
            try {
              this.lastHoveredElement.material.opacity = 1
            } catch(err) {
              console.log(err)
            }
          }

          this.INTERSECTED = null;

        }

      this.renderer.render(this.scene, this.camera)
    }

    private onMouseMove = (event) => {
      this.mouse.x = ((event.clientX - (this.$refs.container as HTMLElement).offsetLeft) /
      ((this.$refs.container as HTMLElement).clientWidth )) * 2 - 1;
      this.mouse.y = -((event.clientY - (this.$refs.container as HTMLElement).offsetTop) /
       ((this.$refs.container as HTMLElement).clientHeight )) * 2 + 1;
    }

    private clearSearchResultFromScene() {
      for (var i = this.meshGroupSearchResult.children.length - 1;i >= 0; i--) {
        this.meshGroupSearchResult.children[i].geometry.dispose()
        this.meshGroupSearchResult.children[i].material.dispose()
        this.meshGroupSearchResult.remove(this.meshGroupSearchResult.children[i])
      }
      this.meshGroupSearchResult.children = []
    }

    private addSearchResult3dObjects(currentIdItems) {

      this.clearSearchResultFromScene()
      var counter = 0, correctX = 0, correctY = 0
      var kx = 5
      var ky = 2 // 10 20 30 40 50

      var local = currentIdItems.length / 10
      ky = 2 * local

      if (local == 2) {
        correctY = -2
      }

      if (local == 3) {
        correctY = -5
      }

      if (local == 4) {
        // 4 * 2
        kx = 10
        ky = 4
        correctY = -5
        correctX = -15
      } else if (local == 5) {
        kx = 10
        ky = 5
        correctY = -6
        correctX = -15
      }

      for (var x = 0;x < kx;x++) {
        for (var y = 0;y < ky;y++) {

          var curPath = "assets/thumbnails/vule" + currentIdItems[counter] + ".jpg"
          var texture = new THREE.TextureLoader().load(curPath)

          var geometry = new THREE.PlaneBufferGeometry(16, 9)
          geometry.scale(0.35, 0.35, 0.35)
          var material = new THREE.MeshBasicMaterial({ map: texture , transparent: true,  opacity: 1})
          var meshPlaneSmall = new THREE.Mesh(geometry, material)
          meshPlaneSmall.name = '_' + currentIdItems[counter]
          meshPlaneSmall.position.z = -9
          meshPlaneSmall.position.x = correctX -12 + x * 5.9
          meshPlaneSmall.position.y = correctY -2 + y * 3.3
          this.meshGroupSearchResult.add(meshPlaneSmall)

          counter++
        }
      }


    }

    private set3dBackground(): void {
      const r = (this.$refs.redcomponent as mdInput).localValue
      const g = (this.$refs.greencomponent as mdInput).localValue
      const b = (this.$refs.bluecomponent as mdInput).localValue
      this.renderer.setClearColor ("rgb(" + r + "," + g + "," + b + ")", 1)
      this.oBackground.r = r
      this.oBackground.g = g
      this.oBackground.b = b
      this.ls.save("o_webglbox_background_r", r.toString())
      this.ls.save("o_webglbox_background_g", g.toString())
      this.ls.save("o_webglbox_background_b", b.toString())
    }

  }
</script>
