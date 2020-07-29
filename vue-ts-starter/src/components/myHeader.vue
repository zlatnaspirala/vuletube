
<template>
  <div class="myHeader">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <md-menu md-size="medium" md-align-trigger>
      <md-button class="md-primary md-raised" md-menu-trigger>Start here</md-button>
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
    <md-menu>
      <md-button class="md-primary md-raised" md-menu-trigger>GO TO</md-button>
      <md-menu-content>
        <md-menu-item>
           <md-button @click="showAboutDialog = true" class="md-primary md-raised" md-menu-trigger>About & Credits</md-button>
        </md-menu-item>
        <md-menu-item>
          <md-button @click="window.open('https://maximumroulette.com:2020', '_blank')"
                     class="md-primary md-raised" md-menu-trigger>KURE Service</md-button>
        </md-menu-item>
      </md-menu-content>
    </md-menu>
    <md-menu>
      <md-button class="md-primary md-raised" @click="this.$props.switchPlaceA" md-menu-trigger>
        <md-icon class="fa fa-superpowers"></md-icon>
      </md-button>
    </md-menu>

    <md-dialog :md-active.sync="showAboutDialog">
      <md-dialog-title>Credits&About</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="Credits">
          <md-content class="md-scrollbar">
            <h2> Used in my project: </h2>
            <md-content v-bind:style="optionsStyle">

              <h3>Project structural/methodology </h3>
              <a target="_blank" href="https://vuejs.org/">https://vuejs.org/</a>

              <h3> youtube.com services </h3>
              <a target="_blank" href="https://youtube.com/">https://youtube.com/</a>

              <h3>JavaScript 3D library. </h3>
              <a target="_blank" href="https://threejs.org/">https://threejs.org/</a>

              <h3>Download videos from youtube in node.js using youtube-dl.</h3>
              <a target="_blank" href="https://www.npmjs.com/package/youtube-dl">https://www.npmjs.com/package/youtube-dl</a>

            </md-content>
          </md-content>
        </md-tab>
        <md-tab md-label="About VuleTube Service">
          <md-content class="md-scrollbar" v-bind:style="optionsStyle">

            <img style="width:200px" src="assets/vule-logo1.png" />
            <h3> Project name: VuleTube service</h3>
            <h4> Mother project is vue-typescript-starter (or vule project generator) </h4>
              <span>VuleTube use two components:</span>
              <span>- myYouTube.vue</span>
              <span>Getting response for youtube search.</span>
              <span>Call server part for saving videos</span>
              <span>- webgl-player.vue</span>
              <span>Open opengles port view, look for</span>
              <span>video source saved to the maximumroulette:3000</span>

              <div id="paypal-button-container"></div>

              <span>This project is open source :</span>
              <a target="_blank" href="https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/LICENSE">LICENCE</a>
              <a target="_blank" href="https://github.com/zlatnaspirala/vue-typescript-starter/">Download source code</a>

          </md-content>
        </md-tab>
      </md-tabs>
      <md-dialog-actions>
        <md-button color="md-primary" @click="showAboutDialog = false">HIDE</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 1px;
  }

  .myHeader {
    width:100%;
    height: 41px;
    -webkit-box-shadow: 1px 1px 3px 3px rgba(0,0,0,0.5);
    -moz-box-shadow: 1px 1px 3px 3px rgba(0,0,0,0.5);
    box-shadow: 1px 1px 3px 3px rgba(0,0,0,0.5);
  }

  .md-content {
    font-size: 150%;
    height: 500px;
  }

</style>

<script lang="ts">

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu,
           mdButton,
           mdIcon,
           mdContent,
           mdProgressSpinner } from 'vue-material'

  const CompProps = Vue.extend({
    props: {
      slogan: String,
      switchPlaceA: { type: Function }
    }
  });

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon,
      mdProgressSpinner,
      mdContent
    }
  })

  @Component
  export default class myHeader extends CompProps {

    declare windowGlobal: Window

    private showAboutDialog: boolean = false

    private optionsStyle = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: '10px',
      itemsAlign: 'left',
      height: '650px'
    }

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

      /* test paypal
              paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'paypal',

      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: '20'
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
              alert('Transaction completed by ' + details.payer.name.given_name + '!');
          });
      }
  }).render('#paypal-button-container');
  */
    }

  }
</script>
