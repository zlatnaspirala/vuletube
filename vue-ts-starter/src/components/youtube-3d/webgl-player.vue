
<template>

  <div v-bind:style="styleObject" >
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>3D VIEW OPTIONS</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="3D VIEW OPTIONS">
          <md-content class="md-scrollbar">

            <md-content>
             <md-field>
              <label>Camera deep: {{ this.camera.position.z }}</label>
                <md-input v-bind:value="this.camera.position.z"
                      v-on:input="testThisFunc"
                      type="range">
                </md-input>
              </md-field>
             </md-content>

             <md-content>
               <h3>Background:</h3>

              <md-field>
              <label>Red component: </label>
                <md-input min="0" max="255" ref="redcomponent" value="0"
                  v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Green component: </label>
                <md-input min="0" max="255" ref="greencomponent" value="0"
                          v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>

              <md-field>
              <label>Blue component: </label>
                <md-input min="0" max="255" ref="bluecomponent" value="0"
                       v-on:input="set3dBackground" type="range">
                </md-input>
              </md-field>
             </md-content>

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

    <md-button class="md-primary md-accent" @click="showDialog = true">webgl support</md-button>
    <md-button class="md-primary md-raised" @click="showDialog = true">SETTINGS</md-button>

    <!-- threejs canvas tag -->
    <div class="canvasDom" ref="container"></div>

  </div>
</template>

<style scoped>
  .canvasDom {
    width:100%;
  }
</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import * as THREE from 'three/build/three.module'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

    private camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 )
    private scene = new THREE.Scene()
    private renderer
    private video
    private container
    private texvideo
    private webcamMesh
    private showDialog: boolean = false

    private planeAddedToScene: boolean = false

    private styleObject = {
      width: '100%'
    }

    constructor() {
      super()
    }

    // lifecycle hook
    mounted (): void {
      this.init()
      this.animate()
    }

    created(): void {

      this.container = this.$refs.container

      console.info("Property options =>", this.$props.arg)

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

    private testThisFunc (currValue: any): void {
      this.camera.position.z = currValue
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
      this.camera.position.z = 0.01;

      var texture = new THREE.VideoTexture( this.video );
      var geometry = new THREE.PlaneBufferGeometry( 16, 9 );
      geometry.scale( 0.5, 0.5, 0.5 );
      var material = new THREE.MeshBasicMaterial( { map: texture } );

      this.webcamMesh = new THREE.Mesh(geometry, material);
      this.webcamMesh.position.z = -9
      this.webcamMesh.position.x = -7
      this.webcamMesh.position.y = 3.5
      // mesh.lookAt(new THREE.Vector3( 0, 0, 0 ));
      geometry.scale(0.3, 0.3, 0.3);
      this.scene.add(this.webcamMesh);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
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

    private onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth / 2, window.innerHeight * 0.8 );
    }

    private animate() {
      requestAnimationFrame( this.animate );
      this.renderer.render( this.scene, this.camera );
    }

    private setupWebcamMesh () {
      // test
    }

    private set3dBackground(): void {
      this.renderer.setClearColor ("rgb(" +
       (this.$refs.redcomponent as any).localValue + "," +
       (this.$refs.greencomponent as any).localValue + "," +
       (this.$refs.bluecomponent as any).localValue + ")", 1);
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
