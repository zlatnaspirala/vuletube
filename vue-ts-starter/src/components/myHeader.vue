
<template>
  <div class="myHeader">
    <!--md-menu>
      <md-button md-menu-trigger>Exec</md-button>
      <md-menu-content>
        <md-menu-item>Run in 3d</md-menu-item>
      </md-menu-content>
    </md-menu-->
    <md-menu md-size="medium" md-align-trigger>
      <md-button md-menu-trigger>Login with</md-button>
      <md-menu-content>
        <md-menu-item>
          <md-progress-spinner v-show='tyfetchVisibility'
            :md-diameter="22"
            :md-stroke="4"
             md-mode="indeterminate">
          </md-progress-spinner>
          <md-button v-show='loginBtnVisibility' @click="googleApiLogin" class="md-icon-button">
            <md-icon>Login</md-icon>
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
    border: solid rgb(13, 111, 136) 1px;
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
        loginBtnVisibility: false
      }
    }

    googleApiLogin(): void {
       this.$root.$emit('googleApiLoginEvent', { start: 'start googleApiLoginEvent' })
    }

    mounted (): void {
      setTimeout(() => {
        this.$set(this, 'tyfetchVisibility', false)
        this.$set(this, 'loginBtnVisibility', true)
      }, 3000)
     console.log('Access props vars: ' + this.$props.slogan)
    }

  }
</script>
