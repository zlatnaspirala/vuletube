
<template>
  <div>
    NUI WEBCAM CONTROL COMPONENT
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
  export default class myFooter extends CompProps {

  }
</script>
