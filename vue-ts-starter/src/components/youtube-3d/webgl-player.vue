<template>
  <div v-bind:style="styleObject" >

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>opengles 2.0/3.0</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="Three.js options">
          <md-content class="md-scrollbar">
            - Options test
          </md-content>
        </md-tab>
      </md-tabs>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <video ref="video" style="display:none" autoplay playsinline></video>
    <div class="canvasDom" ref="container"></div>
    <md-button class="md-primary" @click="showDialog = true">Close</md-button>

  </div>
</template>

<style scoped>
   .canvasDom {
     width:100%;
     border: solid lime 1px;
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
    mdButton,
    mdDialogActions,
    mdContent
   }  from 'vue-material'

  const CompProps = Vue.extend({
    props: {
      textContent: String
    }
  });

  // Register for components
  @Component({
    components: {
      mdButton,
      mdTabs,
      mdTab,
      mdDialogActions,
      mdContent
    }
  })

  @Component
  export default class threejsYoutubePlayer extends CompProps {

    declare YT;

    private camera
    private scene
    private renderer
    private video
    private container

    showDialog = false

    styleObject = {
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
      console.log("======")
    }

    private init() {

      this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
      this.camera.position.z = 0.01;

      this.scene = new THREE.Scene();
      this.video = this.$refs.video;
      console.log(this.video + ' VIDEO')
      var texture = new THREE.VideoTexture( this.video );
      var geometry = new THREE.PlaneBufferGeometry( 16, 9 );
      geometry.scale( 0.5, 0.5, 0.5 );
      var material = new THREE.MeshBasicMaterial( { map: texture } );

      var count = 128;
      var radius = 32;

      for ( var i = 1, l = count; i <= l; i ++ ) {

        var phi = Math.acos( - 1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.setFromSphericalCoords( radius, phi, theta );
        mesh.lookAt( this.camera.position );
        this.scene.add( mesh );

      }

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.9);
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

    private onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    private animate() {
      requestAnimationFrame( this.animate );
      this.renderer.render( this.scene, this.camera );
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
