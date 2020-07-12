<template>
  <div v-bind:style="styleObject" >

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>opengles 2.0 3.0</md-dialog-title>

      <md-tabs md-dynamic-height>
        <md-tab md-label="Three.js">
          <md-content class="md-scrollbar">
            - webGL test 1
          </md-content>
        </md-tab>

        <md-tab md-label="webGl2" >
          <md-content class="md-scrollbar">
            webGL test 2
          </md-content>
        </md-tab>

      </md-tabs>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<style scoped>
</style>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import * as THREE from 'three/build/three.module';
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
  export default class webGLYtPlayer extends CompProps {

    showDialog = false

    styleObject = {
      width: '100%'
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
