<template>
  <div v-bind:style="styleObject" >
    {{ $props.textContent }}
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  const CompProps = Vue.extend({
    props: {
      textContent: String
    }
  });

  @Component
  export default class myFooter extends CompProps {
    test1: string = 'Nikola test'

   styleObject = {
     background: '#616612',
     position: 'absolute',
     bottom: 0,
     textAlign: 'center',
     height: '50px',
     width: '100%',
     paddingTop: '1%'
   }
  }
</script>
