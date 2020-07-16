
<template>
  <div class="myHeader">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <md-menu>
      <md-button md-menu-trigger>3D</md-button>
      <md-menu-content>
        <md-menu-item>About VuleService</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-menu md-size="medium" md-align-trigger>
      <md-button md-menu-trigger>Start here</md-button>
      <md-menu-content>
        <md-menu-item>
          <md-progress-spinner v-show='tyfetchVisibility'
            :md-diameter="22"
            :md-stroke="4"
             md-mode="indeterminate">
          </md-progress-spinner>
          <md-button class="md-primary md-raised" v-show='loginBtnVisibility' @click="googleApiLogin">
            <md-icon class="fa fa-shield"></md-icon>
            Login with Google
          </md-button>
        </md-menu-item>
        <md-menu-item>
          <md-button class="md-primary md-raised" ref="switchThemeBtn" @click="switchTheme">
            <md-icon>T</md-icon>
            Theme {{ switchThemeBtnLabel }}
          </md-button>

      </md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>
</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 1px;
  }

  .myHeader {
    width:100%;
    height: 41px;
  }
</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu, mdButton , mdIcon, mdProgressSpinner } from 'vue-material'

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
      mdIcon,
      mdProgressSpinner,
    }
  })

  @Component
  export default class myHeader extends CompProps {

    constructor() {
      super()
    }

    data() {
      return {
        myData: "test",
        tyfetchVisibility: true,
        loginBtnVisibility: false,
        switchThemeBtnLabel: 'myDark'
      }
    }

    switchTheme() {
      try {
        if ((this.$root as any).$material.theming.theme == 'myDark') {
          (this.$root as any).$material.theming.theme='myLight'
          this.changeTheme('myLight')
        } else if ((this.$root as any).$material.theming.theme == 'myLight') {
          (this.$root as any).$material.theming.theme='myOrange'
          this.changeTheme('myOrange')
        } else if ((this.$root as any).$material.theming.theme == 'myOrange') {
          (this.$root as any).$material.theming.theme='myDark'
          this.changeTheme('myDark')
        } else {
          console.log('(this.$root as any).$material.theming.theme=myDark' , (this.$root as any).$material.theming.theme='myDark')
        }
      }catch(err) {
        console.warn('Error =>', err)
      }
    }

    changeTheme (themeEnu: string) {
      this.$set(this, 'switchThemeBtnLabel', themeEnu)
    }

    googleApiLogin(): void {
       this.$root.$emit('googleApiLoginEvent', { start: 'start googleApiLoginEvent' })
    }

    mounted (): void {
      (this.$root as any).$material.theming.theme='myDark'
      this.$set(this, 'tyfetchVisibility', false)
      this.$set(this, 'loginBtnVisibility', true)
      this.$set(this, 'switchThemeBtnLabel', 'myDark')
      console.log('Load theme Slogan is -> ' + this.$props.slogan)
    }

  }
</script>
