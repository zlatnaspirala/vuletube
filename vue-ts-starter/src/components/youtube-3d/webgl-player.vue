
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
                v-model="oCvStarter">Visibility of results in 3d env.</md-switch>
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

        <md-tab md-label="openCV-webcam">
          <md-content class="md-scrollbar">

            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="oCvStarterOptionsChanged" class="md-primary md-raised"
                v-model="oCvStarter">Enable/Disable openCV component</md-switch>
            </md-content>
          </md-content>

        </md-tab>

      </md-tabs>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Texture video tag  @timeupdate='updateCurrentTime'-->
    <video ref="texvideo"
           src="default-assets/3dtshirts.mp4"
           v-bind:style="{ display: 'none',
                          position: 'absolute',
                          top: '-1000px' }"
           autoplay
           playsinline ></video>

    <!-- WebCam texture video tag -->
    <video ref="webcam" v-bind:style="{ display: 'none' }" autoplay playsinline></video>

    <canvas id="cvcanvas" ref="cvcanvas"
            v-bind:style="{ display: 'block', position: 'absolute', right : 0 }"
            width="640" height="480" style="bottom: 0;"></canvas>

    <md-field class="menubox">
      <md-button class="md-primary md-raised" @click="showDialog = true">
        <md-icon class="fa fa-cog"></md-icon>
      </md-button>

      <md-menu class="menuModeMenu" >
        <md-button class="md-primary md-raised" md-menu-trigger>Mode</md-button>
        <md-menu-content>
          <md-menu-item >
            <md-button @click="setClassicPreviewMode()"
                       class="md-primary md-raised" v-bind:style="{ padding: 0 , margin: 0, width: '100%' }"
                       md-menu-trigger>Classic - plane</md-button>
          </md-menu-item>
          <md-menu-item>
            <md-button @click="setFirstPersonPreviewMode()" v-bind:style="{ padding: 0 , margin: 0}"
                      class="md-primary md-raised" md-menu-trigger>First person gallery</md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-button class="md-primary md-raised"
                 @click="videoCameraOptionsChanged"
                 v-model="optionsVideoCamera">
        <md-icon :class="{'activeCamera': optionsVideoCamera === true}"
                  class="fa fa-video-camera"></md-icon>
      </md-button>
      <md-button class="md-primary md-raised" @click="searchResultPreviewOptionsChanged()"
                 v-model="optionsSearchResultPreview">
        <md-icon ref="menuOptionsSearchResultPreviewIcon" class="fa fa-th"></md-icon>
      </md-button>
      <md-button class="md-primary md-raised" @click="$refs.texvideo.play()">
        <md-icon class="fa fa-play"></md-icon>
      </md-button>
      <md-button class="md-primary md-raised" @click="$refs.texvideo.pause()">
        <md-icon class="fa fa-pause"></md-icon>
      </md-button>
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

  .activeCamera {
    color: red !important;
  }

  .canvasDom {
    width:100%;
  }

  .md-tab {
    padding: 25px 25px 25px 25px;
  }

  .currentTimeField {
    margin: 4px 0 0;
  }

  .menuModeMenu {
    padding-top: 6px;
  }

  .menuModeMenuContent {
    padding: 1px 1px 1px 1px !important;
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
  import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
  import LocalStorageMemory from '../../local-storage/local-storage'
  import { asyncLoad } from '../../my-common/common-func'
  import CvStarter from '../../../public/submodules/opencv-starter/src/ecma6/main.js'
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
import { CvStarterOptions, EFFECT_TYPE, IPreviewMode } from './webgl-player'

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
  export default class threejsYoutubePlayer extends CompProps implements threejsYoutubePlayer {

    declare YT;

    private ls: LocalStorageMemory = new LocalStorageMemory()
    private camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    private scene = new THREE.Scene()
    private renderer = new THREE.WebGLRenderer({ antialias: true })
    private raycaster = new THREE.Raycaster()
    private mouse = new THREE.Vector2()
    private orbitControls: OrbitControls
    private container
    private videoWebCam
    private webcamMesh
    private hudHidePlayer
    private mainVideoMesh
    private previewMode: string = IPreviewMode.classic
    private firstPersonControls: any = null
    private cvEffectCanvas
    private meshGroupSearchResult = new THREE.Object3D()
    private meshGroupHudControls = new THREE.Object3D()
    private INTERSECTED: any = null
    private preventRaycastClickAction: boolean = false
    private lastHoveredElement: any

    private showDialog: boolean = false
    private optionsSearchResultPreview: boolean = false
    private itemsLength: number = 0;
    private planeAddedToScene: boolean = false
    private previewPerPage: number = 25
    private optionsVideoCamera: boolean = false
    private isVideoCameraActive: boolean = false
    private videoCameraStream: MediaStream | null = null

    private localCurrentTime: any = null

    private cvStarter: CvStarter | null = null;

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

    private oCvStarter: boolean = true

    private on3dKeyDown = (event: any) => {}
    private on3dKeyUp = (event: any) => {}

    // UNRESOLVED VUE LIMITATIONS
    // For audio and video html object cat not be used bind: v-model or any
    // Effect : initialy load value without update, or lag video on @time
    // I will use classic native js interval call
    // Works perfect
    private runVideoReactor() {
      setInterval(() => {
        this.localCurrentTime = (this.$refs.texvideo as HTMLVideoElement).currentTime.toFixed(2)
      }, 500)
    }

    mounted (): void {

      console.log(this.previewMode + "<<<<<<<<<<<")
      this.optionsVideoCamera = this.ls.load("o_camera")

      this.init()
      this.animate()

      this.oCvStarter = this.ls.load("o_webglbox_opencv_starter_for_camera")

      if (this.oCvStarter === true && this.optionsVideoCamera === true) {
        this.runCvjsLoader('WEBCAM')
        console.info("CVJS LOADING WEBCAM")
      }

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

    /**
     * @description Create enum for input flag
     * Its not bad place but this also need
     * to be done on any other action.
     */
    runCvjsLoader(injectComponentFlag?: string) : void {

      let current_: HTMLVideoElement;

      if (typeof injectComponentFlag === 'undefined') {
        injectComponentFlag = 'PLAYED_VIDEO'
      }

     if (injectComponentFlag === 'PLAYED_VIDEO') {
       // test
       current_ = this.$refs.texvideo as HTMLVideoElement
     } else {
       current_ = this.$refs.webcam as HTMLVideoElement
     }

      if (this.cvStarter === null) {

        var cvjsLoader = function(cvjsCallback) {

          asyncLoad("/submodules/opencv-starter/node_modules/webrtc-adapter/out/adapter.js", () => {
            asyncLoad("/submodules/opencv-starter/src/lib/stats.js", () => {
              asyncLoad("/submodules/opencv-starter/src/lib/data-gui.js", () => {
                asyncLoad("/submodules/opencv-starter/src/lib/opencv-3.4.0.js", cvjsCallback)
              })
            })
          })

        }

        cvjsLoader(() => {
          var root = this;
          const options: CvStarterOptions = {
            videoProcessing: true,
            injectVideo: (current_ as HTMLVideoElement),
            injectCanvas: "cvcanvas"
          }
          root.cvStarter = new CvStarter(options)
          console.log("cv inject video is ", current_)
          console.log("this.cvStarter", root.cvStarter)
        })

      } else {
        /**
         * Run opencv
         */
        const options = {
          videoProcessing: true,
          injectVideo: (current_ as HTMLVideoElement),
          injectCanvas: "cvcanvas"
        }
        this.cvStarter = new CvStarter(options)
        console.log("this.cvStarter", this.cvStarter)
      }

    }

    created(): void {

      this.container = this.$refs.container as HTMLElement
      this.cvEffectCanvas = this.$refs.cvcanvas as HTMLCanvasElement

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

        this.itemsLength = args.items.length;

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

            if (!this.preventRaycastClickAction) {
              console.log(">>  this.cvStarter>>",  this.cvStarter)
              this.prepareThisVideo(intersects[0].object.name.substring(1))
            }

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

    private oCvStarterOptionsChanged(value): void {

      this.ls.save("o_webglbox_opencv_starter_for_camera", value)
      console.info("oCvStarterOptionsChanged => ", value)

      if (value === true && this.optionsVideoCamera === true) {
        this.runCvjsLoader('WEBCAM')
        console.info("CVJS LOADING WEBCAM")
      } else {
        this.runCvjsLoader('PLAYED_VIDEO')
        console.info("CVJS LOADING PLAYED_VIDEO")
      }

    }

    private previewPerPageChanged(value): void {
      this.previewPerPage = value
      this.ls.save('o_webglbox_preview_per_page', value)
    }

    private searchResultPreviewOptionsChanged(value): void {
      this.ls.save("o_webglbox_search_results_preview", value)
      this.meshGroupSearchResult.visible = value

      console.log(">>>>>this.$refs.menuOptionsSearchResultPreviewIcon>>>>>>>>", this.$refs.menuOptionsSearchResultPreviewIcon)

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
        this.$refs.texvideo["style"].display = "block";

        // (this.$refs.texvideo as HTMLVideoElement).addEventListener("canplay", () => { })
        // Only with prevent double call

        console.log("TEST TRY SOURCE FUNC", this.cvStarter)


        setTimeout(() => {

            this.runCvjsLoader('PLAYED_VIDEO')

        }, 2000)

        setTimeout(() => {

          this.prepareVideoTexture('plane', EFFECT_TYPE.CVVIDEOPROCESSING)

        }, 4000)

        console.info("Trying source ...")

      }catch(err) {
        console.warn("Link is broken...", err)
      }
    }

    /**
     * @description Space for classic three.js
     * initial instancing work.
     */
    private init() {

      this.videoWebCam = this.$refs.webcam;
      this.camera.position.z = this.ls.load("o_webglbox_camera_z");

      var texture = new THREE.VideoTexture(this.videoWebCam)
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

      /**
       * @description HUD 3d buttons:
       *  - Hide 3d player
       */
      material = new THREE.MeshBasicMaterial({ color: 0x003344 })

      this.hudHidePlayer = new THREE.Mesh(geometry, material)
      this.hudHidePlayer.position.z = -10
      this.hudHidePlayer.position.x = 7
      this.hudHidePlayer.position.y = 4.5
      this.meshGroupHudControls.add(this.hudHidePlayer)

      // ask
      this.scene.add(this.webcamMesh)
      // ask
      this.scene.add(this.meshGroupSearchResult)

      console.log("test>>>>>>>>>>>>")
      this.scene.add(this.meshGroupHudControls)

      /**
       * @description 3d button
       * hide 3d video mesh (player).
       */

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.858);
      (this.$refs.container as HTMLElement).appendChild(this.renderer.domElement);

      /**
       * @description branch here..
       */
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      // controls.enableZoom = false;
      this.orbitControls.enablePan = true;

      // this.firstPersonControls = new PointerLockControls( this.camera, document.body )
      this.firstPersonControls = {
        controls: null,
        velocity: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        vertex: new THREE.Vector3(),
      }

      // Attached to window
      window.addEventListener('resize', this.onWindowResize, false)
      window.addEventListener('click', this.rayClickHandler, false)
      window.addEventListener('mouseup', this.onMouseUp, false)

      this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false)

      this.accessVideoCamera()

    }

    private stopVideoCamera() {

      if (this.videoCameraStream) {
        var track = this.videoCameraStream.getTracks()[0]
        track.stop()
        this.isVideoCameraActive = false
      }

    }

    private accessVideoCamera() {

      if (this.optionsVideoCamera == false) {
        return;
      }

      if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

        var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } }
        navigator.mediaDevices.getUserMedia( constraints ).then((stream) => {
          this.videoWebCam.srcObject = stream
          this.videoCameraStream = stream
          this.videoWebCam.play();
          this.isVideoCameraActive = true
        }).catch((error) => {
          console.error( 'Unable to access the camera/webcam.', error )
          this.isVideoCameraActive = false
        })

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

    private prepareVideoTexture = (visualShape: string, effectType: string) => {

      var texture,
          material,
          geometry,
          materialLocal

        /**
         * Make sure that video plays
         */
        try {
          (this.$refs.texvideo as HTMLVideoElement).play()
        } catch(err) {
          console.log(err)
        }

      if(visualShape === "plane") {

        if (this.planeAddedToScene === false) {

          geometry = new THREE.PlaneBufferGeometry(16, 9)
          if (this.cvStarter) {
            console.log(" TESTTEST ", EFFECT_TYPE.NOEFFECT)
          }

          if (effectType === EFFECT_TYPE.NOEFFECT) {
            texture = new THREE.CanvasTexture(this.$refs.cvcanvas)
            texture.needsUpdate = true;
            // ori texture = new THREE.VideoTexture(this.texvideo)
          } else if (effectType === EFFECT_TYPE.CVVIDEOPROCESSING) {
            texture = new THREE.CanvasTexture(this.$refs.cvcanvas)
            texture.needsUpdate = true;
            // potencial activation for video processing here...
          }

          material = new THREE.MeshBasicMaterial({ map: texture })
          material.needsUpdate = true;
          material.map.needsUpdate = true;

          geometry.scale(1.4, 1, 1)

          this.mainVideoMesh = new THREE.Mesh(geometry, material)
          this.mainVideoMesh.position.z = -8
          this.scene.add(this.mainVideoMesh)
          this.planeAddedToScene = true

        } else {

          /**
           * @description
           * Update texture.
           */
          texture = new THREE.CanvasTexture(this.$refs.cvcanvas)
          texture.needsUpdate = true;
          materialLocal = new THREE.MeshBasicMaterial({ map: texture })
          materialLocal.needsUpdate = true;
          materialLocal.map.needsUpdate = true;
          this.mainVideoMesh.material = materialLocal
          this.mainVideoMesh.material.needsUpdate = true;


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

      if (this.scene.children.length > 3) {
        this.scene.children[3].material.map.needsUpdate = true;
      }

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

    private onMouseUp = () => {
      this.preventRaycastClickAction = false
    }

    private onMouseMove = (event) => {

      this.preventRaycastClickAction = true
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

      // Block code
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

    private setDefaultWebCamCVstarter() {

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

    private videoCameraOptionsChanged() {
      this.optionsVideoCamera = !this.optionsVideoCamera
      this.ls.save("o_camera", this.optionsVideoCamera)

      if (this.isVideoCameraActive === true && this.optionsVideoCamera === false) {

        // turn off
        console.info("Turn off private webcamera...")
        this.stopVideoCamera();
        (this.$refs.cvcanvas as HTMLElement).style.display = 'none'

        //
        this.$root.$emit('privateCameraOff', { detail: 'Video webcam stoped on user request.' })


      } else if (this.isVideoCameraActive === false && this.optionsVideoCamera === true) {

        // turn on
        console.info("Turn on private webcamera...")
        this.accessVideoCamera();

        if (this.oCvStarter === true) {

          /**
           * @description No need for now but interest
           * like extra canvas 2d work.
           */
          // (this.$refs.cvcanvas as HTMLElement).style.display = 'block'

          this.$root.$emit('privateCameraOn', { detail: 'Video webcam stoped on user request.' })

          /**
           * @description Must be tested in memory aspect ?!?!
           * This is fo rtest proporse only => `this.runCvjsLoader()`
           * Fixed.
           */

          this.runCvjsLoader('WEBCAM')

        }


      }

    }

    /**
     * @description optimized, no need for removing element
     * and theres loaded textures. `Block code` can be optimized.
     * @return void
     */
    private setClassicPreviewMode(): void {

      // Block code
      var counter = 0, correctX = 0, correctY = 0
      var kx = 5
      var ky = 2 // 10 20 30 40 50

      var local = this.itemsLength / 10
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

      console.log("Classic plane preview mode ...")

      for (var x = 0;x < kx;x++) {
        for (var y = 0;y < ky;y++) {

          // geometry.scale(0.35, 0.35, 0.35)
          // meshPlaneSmall.name = '_' + currentIdItems[counter]
          this.meshGroupSearchResult.children[counter].position.z = -9
          this.meshGroupSearchResult.children[counter].position.x = correctX -12 + x * 5.9
          this.meshGroupSearchResult.children[counter].position.y = correctY -2 + y * 3.3
          // this.meshGroupSearchResult.add(meshPlaneSmall)

          counter++

        }
      }


    }

    private deactivateFirspPerson() {

    }

    private setFirstPersonPreviewMode() {

      console.log("FP preview mode ...")

      this.orbitControls.enabled = false;

      this.firstPersonControls.moveForward = false
      this.firstPersonControls.moveLeft = false
      this.firstPersonControls.moveBackward = false
      this.firstPersonControls.moveRight = false
      this.firstPersonControls.canJump = false
      this.firstPersonControls.prevTime = performance.now()

      let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
      floorGeometry.rotateX( - Math.PI / 2 );
      const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } )
      const floor = new THREE.Mesh( floorGeometry, floorMaterial )
      this.scene.add( floor )

      this.firstPersonControls.floorObjects = []

      this.firstPersonControls.update = () => {

        const time = performance.now()

        if (this.firstPersonControls.controls.isLocked === true ) {

          this.raycaster.ray.origin.copy(this.firstPersonControls.controls.getObject().position)
          this.raycaster.ray.origin.y -= 10

          const intersections = this.raycaster.intersectObjects( this.firstPersonControls.floorObjects )

          const onObject = intersections.length > 0;

          const delta = ( time - this.firstPersonControls.prevTime ) / 1000;

          this.firstPersonControls.velocity.x -= this.firstPersonControls.velocity.x * 10.0 * delta;
          this.firstPersonControls.velocity.z -= this.firstPersonControls.velocity.z * 10.0 * delta;

          this.firstPersonControls.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

          this.firstPersonControls.direction.z = Number(this.firstPersonControls.moveForward) - Number(this.firstPersonControls.moveBackward)
          this.firstPersonControls.direction.x = Number(this.firstPersonControls.moveRight) - Number(this.firstPersonControls.moveLeft)
          this.firstPersonControls.direction.normalize();

          if (this.firstPersonControls.moveForward ||  this.firstPersonControls.moveBackward )  this.firstPersonControls.velocity.z -=  this.firstPersonControls.direction.z * 400.0 * delta;
          if (this.firstPersonControls.moveLeft ||  this.firstPersonControls.moveRight)  this.firstPersonControls.velocity.x -=  this.firstPersonControls.direction.x * 400.0 * delta;

          if (onObject === true ) {
            this.firstPersonControls.velocity.y = Math.max(0, this.firstPersonControls.velocity.y)
            this.firstPersonControls.canJump = true
          }

          this.firstPersonControls.controls.moveRight( -  this.firstPersonControls.velocity.x * delta )
          this.firstPersonControls.controls.moveForward( -  this.firstPersonControls.velocity.z * delta )

          this.firstPersonControls.controls.getObject().position.y += ( this.firstPersonControls.velocity.y * delta )

          if (this.firstPersonControls.controls.getObject().position.y < 10) {

            this.firstPersonControls.velocity.y = 0
            this.firstPersonControls.controls.getObject().position.y = 10
            this.firstPersonControls.canJump = true

          }

        }

        this.firstPersonControls.prevTime = time

      }

      this.firstPersonControls.controls = new PointerLockControls(this.camera, document.body)
      this.firstPersonControls.controls.lock();

      // test
      this.scene.add(this.firstPersonControls.controls.getObject())

      this.on3dKeyUp = function(event) {

        switch (event.keyCode) {

          case 38: // up
          case 87: // w
            this.firstPersonControls.moveForward = false
            break;

          case 37: // left
          case 65: // a
            this.firstPersonControls.moveLeft = false
            break;

          case 40: // down
          case 83: // s
            this.firstPersonControls.moveBackward = false
            break;

          case 39: // right
          case 68: // d
            this.firstPersonControls.moveRight = false
            break;

        }

      }

      this.on3dKeyDown = function(event) {

        switch ( event.keyCode ) {

          case 38: // up
          case 87: // w
            this.firstPersonControls.moveForward = true
            break;

          case 37: // left
          case 65: // a
            this.firstPersonControls.moveLeft = true
            break;

          case 40: // down
          case 83: // s
            this.firstPersonControls.moveBackward = true
            break;

          case 39: // right
          case 68: // d
            this.firstPersonControls.moveRight = true
            break;

          case 32: // space
            if ( this.firstPersonControls.canJump === true ) this.firstPersonControls.velocity.y += 350;
            this.firstPersonControls.canJump = false;
            break;

        }

      }

      this.renderer.domElement.addEventListener('keydown', this.on3dKeyDown, false)
      this.renderer.domElement.addEventListener('keyup', this.on3dKeyUp, false)

      // reposition
      // Block code
      var counter = 0, correctX = 1, correctY = 1
      var kx = 5
      var ky = 2 // 10 20 30 40 50

      var local = this.itemsLength / 10
      ky = 2 * local

      console.log("Classic plane preview mode ...")

      var localNeg = -1

      for (var x = 0;x < this.meshGroupSearchResult.children.length;x++) {

          // geometry.scale(0.35, 0.35, 0.35)
          // meshPlaneSmall.name = '_' + currentIdItems[counter]
          this.meshGroupSearchResult.children[x].position.z = -9 - x * 8

          // this.meshGroupSearchResult.children[x].rotation.set(new THREE.Vector3( 0, 0, -Math.PI / 2));

          this.meshGroupSearchResult.children[x].position.x = x * 4 * localNeg
          if (localNeg === -1) {
            localNeg = 1
          } else {
            localNeg = -1
          }
          // this.meshGroupSearchResult.children[x].position.y = correctY * 4
          // this.meshGroupSearchResult.add(meshPlaneSmall)
          correctY++
          counter++

      }


    }

  }
</script>
