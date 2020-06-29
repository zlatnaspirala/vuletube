<template>
  <div>
    <p>COMPONENT  PROP: {{ msg }}</p>
    <p>COMPONENT : {{ helloTimes }}</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  // import { Prop } from 'vue-property-decorator';

  const CompProps = Vue.extend({
    props: {
      msg: String
    }
  });

  @Component
  export default class HelloWorld extends CompProps {

    // @Prop() msg: string

    helloTimes: number = 0
    test: string = 'Nikola test'
    sayHello () {
      this.helloTimes++
    }

  }
</script>
