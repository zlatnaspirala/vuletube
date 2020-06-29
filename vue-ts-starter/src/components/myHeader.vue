<template>
  <div>
    <md-menu>
      <md-button md-menu-trigger>Games</md-button>

      <md-menu-content>
        <md-menu-item>My Item 1</md-menu-item>
        <md-menu-item>My Item 2</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-menu md-size="medium" md-align-trigger>
      <md-button md-menu-trigger>Align with trigger</md-button>

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
</style>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  // import { Prop } from 'vue-property-decorator';
  import { mdMenu, mdButton , mdIcon } from 'vue-material'

  const CompProps = Vue.extend({
    props: {
      msg: String
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

    // @Prop() msg: string

    helloTimes: number = 0
    test1: string = 'Nikola test'
    sayHello () {
      this.helloTimes++
    }
    greet (): void {
      console.log('Greeting: ' + this.msg)
      // this.$refs.HelloWorld.sayHello()
    }

  }
</script>
