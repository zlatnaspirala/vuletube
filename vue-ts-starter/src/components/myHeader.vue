
<template>

  <div class="myHeader">
    <md-menu>
      <md-button md-menu-trigger>Games</md-button>

      <md-menu-content>
        <md-menu-item>Example 1</md-menu-item>
        <md-menu-item>My Item 2</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-menu md-size="medium" md-align-trigger>
      <md-button md-menu-trigger>Login with</md-button>
      <md-menu-content>
        <md-menu-item>
          <md-button class="md-icon-button">
            <md-icon>home</md-icon>
          </md-button>
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>

</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 24px;
  }

  .myHeader {
    width:100%;
    border: solid red 1px;
  }
</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu, mdButton , mdIcon } from 'vue-material'
  // import { Prop } from 'vue-property-decorator';


  const CompProps = Vue.extend({
    props: {
      slogan: String
    }
  });

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon
    }
  })

  @Component
  export default class myHeader extends CompProps {

    // @Prop() slogan: string

    constructor() {
      super()
    }

    helloTimes: number = 0

    test1: string = 'Nikola test'

    sayHello () {
      this.helloTimes++
    }

    mounted (): void {
     console.log('Access props vars: ' + this.$props.slogan)
    }

  }
</script>
