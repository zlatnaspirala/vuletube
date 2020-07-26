
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
              <md-input v-bind:value="this.previewPerPage"
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
                <md-input min="0" max="255" ref="redcomponent" v-bind:value="this.optionsBackground.backgroundR"
                  v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Green component: </label>
                <md-input min="0" max="255" ref="greencomponent" v-bind:value="this.optionsBackground.backgroundG"
                          v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Blue component: </label>
                <md-input min="0" max="255" ref="bluecomponent" v-bind:value="this.optionsBackground.backgroundB"
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

    <!-- Texture video tag -->
    <video ref="texvideo"
           v-bind:style="{ display: 'none',
                          position: 'absolute',
                          top: '-1000px' }"
           autoplay
           playsinline ></video>

    <!-- WebCam texture video tag -->
    <video ref="webcam" v-bind:style="{ display: 'none' }" autoplay playsinline></video>

    <!--md-button class="md-primary md-accent" @click="showDialog = true">webgl support</md-button-->
    <md-button class="md-primary md-raised" @click="showDialog = true">3D VIEW OPTIONS</md-button>

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
    private video
    private container
    private texvideo

    private webcamMesh
    private meshGroupSearchResult = new THREE.Object3D()

    private showDialog: boolean = false
    private planeAddedToScene: boolean = false

    private previewPerPage: number = 25

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
      // paddingLeft: '10px'
    }

    private optionsBackground = {
      backgroundR: 0,
      backgroundG: 0,
      backgroundB: 0
    }

    private optionsSearchResultPreview: boolean = false
    //  Boolean(this.$props.arg.options.searchBox.visibilityThumbnails)

    // lifecycle hook
    mounted (): void {

      this.init()
      this.animate()

      this.optionsBackground.backgroundR = this.ls.load("o_webglbox_background_r")
      this.optionsBackground.backgroundG = this.ls.load("o_webglbox_background_g")
      this.optionsBackground.backgroundB = this.ls.load("o_webglbox_background_b")

      this.optionsSearchResultPreview = this.ls.load("o_webglbox_search_results_preview")

      this.renderer.setClearColor ("rgb(" +
        this.optionsBackground.backgroundR + "," +
        this.optionsBackground.backgroundG+ "," +
        this.optionsBackground.backgroundB + ")"
      )

    }

    created(): void {

      this.container = this.$refs.container

      this.$root.$on('reziseCanvas', () => {
       this.setCanvasElementSize()
      });

      this.$root.$on('ytItemsReady', (args) => {

        var testString = ''
        // args.items
        args.items.forEach(element => {
          console.log(".....", element.id.videoId)
          testString += ',' + element.id.videoId
        });

        console.log("BEFORE FETCH IN WEGBL ", args)

        var testLogic = false

        fetch('/saveThumbnails?imgs=' + testString)
          .then((response) => {

            // console.log("OK I WILL TRY IT IN ", args)
            console.log("OK I WILL TRY IT IN ", args)
            if (this.optionsSearchResultPreview && testLogic == true) {
              // this.addSearchResult3dObjects(args.items)
            }

            console.log(">>>>>>>>>>>>>>>>>" + response)
          }).catch(function(err) {
            console.log('Fetch in webgl component: ', err);
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

    private previewPerPageChanged() {
      console.log(" ewPerPageChanged >>>>>>>>>>>>")
    }

    private searchResultPreviewOptionsChanged() {
      console.log(" searchResultPreviewOptionsChanged >>>>>>>>>>>>")
    }

    private setCameraDeepByZ(currValue: any): void {
      this.camera.position.z = currValue
      // console.log("New value ", currValue)
      this.ls.save("o_webglbox_camera_z", currValue)

    }

    private trySource(args: any) {

      console.log("Try source", args)
      try {
        (this.$refs.texvideo as HTMLVideoElement).src = "https://maximumroulette.com:3000/videos/vule" + args.videoId + ".mp4"
        this.$refs.texvideo["style"].display = "block"

        setTimeout(() => {
          this.prepareVideoTexture('plane')
        }, 7000)

        alert("Please wait 5 sec...")

      }catch(err) {
        console.warn("Link is broken...", err)
      }
    }

    private init() {

      this.video = this.$refs.webcam;
      this.camera.position.z = this.ls.load("o_webglbox_camera_z");

      // ORIGINAL var texture = new THREE.VideoTexture( this.video )
      var texture = new THREE.TextureLoader().load('assets/vule-logo1.png')

      var geometry = new THREE.PlaneBufferGeometry( 16, 9 );
      geometry.scale(0.5, 0.5, 0.5)
      var material = new THREE.MeshBasicMaterial({ map: texture })

      this.webcamMesh = new THREE.Mesh(geometry, material)
      this.webcamMesh.position.z = -9
      this.webcamMesh.position.x = -7
      this.webcamMesh.position.y = 3.5
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
      controls.enableZoom = false;
      controls.enablePan = false;

      window.addEventListener('resize', this.onWindowResize, false);

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
        console.error( 'MediaDevices interface not available.' );
      }

      // Last action
      // this.set3dBackground()

    }

    private prepareVideoTexture = (visualShape: string) => {

      if(visualShape === "plane") {

        this.texvideo = this.$refs.texvideo
        var texture = new THREE.VideoTexture( this.texvideo)
        var geometry = new THREE.PlaneBufferGeometry(16, 9)
        geometry.scale(1.4, 1, 1)

        var material = new THREE.MeshBasicMaterial({ map: texture })
        var mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -10
        mesh.lookAt(this.camera.position)

        if (this.planeAddedToScene === false) {
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
        console.warn(".....")
        return
      }
      this.renderer.setSize((this.$refs.container as HTMLElement).clientWidth, window.innerHeight * 0.81)
    }

    private onWindowResize() {

      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.setCanvasElementSize()

    }

    private animate() {
      requestAnimationFrame( this.animate );
      this.renderer.render( this.scene, this.camera );
    }

    private clearSearchResultFromScene() {
      for (var i = this.meshGroupSearchResult.children.length - 1;i >= 0; i--) {
        this.meshGroupSearchResult.children[i].geometry.dispose()
        this.meshGroupSearchResult.children[i].material.dispose()
        this.meshGroupSearchResult.remove(this.meshGroupSearchResult.children[i])
      }
      this.meshGroupSearchResult.children = []
    }

    private addSearchResult3dObjects(currentItems) {
      // test dev
      console.log("COOLLLLL, clear first not best good for now")
      this.clearSearchResultFromScene()

      for (var x = 0;x < currentItems.length / 2;x++) {
        for (var y = 0;y < currentItems.length / 2;y++) {

          // currentItems[0].snippet.thumbnails.medium.url
          // DEV

          var texture = new THREE.TextureLoader().load( )

          var geometry = new THREE.PlaneBufferGeometry(16, 9)
          geometry.scale(0.25, 0.25, 0.25)
          var material = new THREE.MeshBasicMaterial({ map: texture })
          var meshPlaneSmall = new THREE.Mesh(geometry, material)
          meshPlaneSmall.position.z = -9
          meshPlaneSmall.position.x = -7 + x * 3
          meshPlaneSmall.position.y = -8 + y * 3
          this.meshGroupSearchResult.add(meshPlaneSmall)

        }
      }


    }

    private set3dBackground(): void {

      this.renderer.setClearColor ("rgb(" +
        (this.$refs.redcomponent as mdInput).localValue + "," +
        (this.$refs.greencomponent as mdInput).localValue + "," +
        (this.$refs.bluecomponent as mdInput).localValue + ")", 1)

      this.ls.save("o_webglbox_background_r", (this.$refs.redcomponent as mdInput).localValue.toString())
      this.ls.save("o_webglbox_background_g", (this.$refs.greencomponent as mdInput).localValue.toString())
      this.ls.save("o_webglbox_background_b", (this.$refs.bluecomponent as mdInput).localValue.toString())
    }

  }
</script>

<style lang="scss" scoped>
  .md-dialog /deep/.md-dialog-container {
    max-width: 1000px;
  }

  .md-content {
    max-width: 100%;
    max-height: 520px;
    overflow: auto;
  }
</style>
