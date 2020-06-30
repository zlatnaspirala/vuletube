
<template>
  <div id="app">

    <myHeader slogan='testtfreerfgest 123'></myHeader>
    <!--input v-model="msg">
    <p>prop: {{ AppPropVersion }}</p>
    <p>msg: {{ msg }}</p>
    <p>helloMsg: {{ helloMsg }}</p>
    <p>computed msg: {{ computedMsg }}</p>
    <HelloWorld ref="HelloWorld" msg="Vue TypeScript App" />
    <p> <button @click="greet">Greet</button> </p>
    <p> Clicked: {{ count }} times <button @click="increment">+</button> </p-->

  </div>
</template>

<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator';
  import myHeader from './components/myHeader.vue';
  import { mapState, mapMutations } from 'vuex';
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  import 'vue-material/dist/theme/black-green-dark.css' // This line here

  Vue.use(VueMaterial)

  import './styles/style.scss'

  /**
   *  We declare the props separately
   *  to make props types inferable.
   */
  const AppProps = Vue.extend({
    props: {
      AppPropVersion: String
    }
  });

  // Register for components
  @Component({
    components: {
      myHeader
    },
    // Vuex's component binding helper can use here
    computed: mapState([
      'count'
    ]),
    methods: mapMutations([
      'increment'
    ])
  })

  export default class App extends AppProps {

    // annotate refs type
    $refs!: { myHeader: myHeader }

    // additional declaration is needed
    // when you declare some properties in `Component` decorator
    count!: number
    increment!: () => void

    // inital data
    msg: number = 123

    // use prop values for initial data
    helloMsg: string = 'Hello, ' + this.AppPropVersion

    // method
    greet (): void {
      console.log('Greeting: ' + this.msg)
      // this.$refs.myHeader.sayHello()
    }

    // computed
    get computedMsg (): string {
      return 'computed ' + this.msg
    }

    // lifecycle hook
    mounted (): void {
      this.greet()
    }

  }

</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 60px;
  }
</style>
