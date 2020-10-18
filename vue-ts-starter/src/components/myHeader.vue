
<template>
  <div ref="myHeader" class="myHeader">

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
           <md-button @click="showAboutDialogClick()" class="md-primary md-raised" md-menu-trigger>Donate, About and Credits</md-button>
        </md-menu-item>
        <md-menu-item>
          <md-button @click="window.open('https://maximumroulette.com:2020', '_blank')"
                     class="md-primary md-raised" md-menu-trigger>Try video chat</md-button>
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
            <h3> Used in my project: </h3>
            <md-content v-bind:style="optionsStyle">

              <h4> youtube.com API Services </h4>
              <img style="width:300px" src="/assets/ytlogolight.png" />
              <img style="width:300px" src="/assets/ytlogo.png" />
              <a target="_blank" href="https://youtube.com/">https://youtube.com/</a>

              <h4>Project structural/methodology </h4>
              <a target="_blank" href="https://vuejs.org/">https://vuejs.org/</a>

              <h4>JavaScript 3D library. </h4>
              <a target="_blank" href="https://threejs.org/">https://threejs.org/</a>

              <h5>Download videos from youtube in node.js using youtube-dl.</h5>
              <a target="_blank" href="https://www.npmjs.com/package/youtube-dl">https://www.npmjs.com/package/youtube-dl</a>

            </md-content>
          </md-content>
        </md-tab>

        <md-tab md-label="Donate">
          <md-content class="md-scrollbar" style="text-align:center;" >
            <h3> Thank you for using my software. </h3>
            <br>
            <div id="paypal-button-container"></div>
          </md-content>
        </md-tab>

        <md-tab md-label="About VuleTube Service">
          <md-content class="md-scrollbar" v-bind:style="optionsStyle">
            <img style="width:200px;margin: -5px -5px -5px -5px;" src="/assets/vule-logo1.png" />
            <h3> Project name: VuleTube service</h3>
            <b> Mother project is vue-typescript-starter (or vule project generator) </b>
            <br>
              <span>VuleTube use two components:</span>
              <span>- myYouTube.vue</span>
              <span>Getting response for youtube search.</span>
              <span>Call server part for saving videos</span>
              <span>- webgl-player.vue</span>
              <span>Open opengles port view, look for</span>
              <span>video source saved to the maximumroulette:3000</span>

              <p>This project is open source :</p>

              <a target="_blank" href="https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/LICENSE">LICENCE</a>
              <br>
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
    font-size: 110%;
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
  import { switchTheme } from './../my-common/common-func'
  import IHeader from './IHeader'

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
  export default class myHeader extends CompProps implements IHeader{

    declare windowGlobal: Window | any
    declare paypal: any

    private showAboutDialog: boolean = false

    public optionsStyle = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: '10px',
      itemsAlign: 'left',
      height: '650px'
    }

    constructor() {

      super()
      this.windowGlobal = window
      this.switchTheme = switchTheme.bind(this)

    }

    data() {
      return {
        myData: "test",
        tyfetchVisibility: true,
        loginBtnVisibility: false,
        switchThemeBtnLabel: 'myDark'
      }
    }

    switchTheme() {}

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

    }

    createPayPalDonateButton() {

      var root = this
      var myPaypal = document.createElement("script")
      myPaypal.src = "https://www.paypal.com/sdk/js?client-id=AT1RiWCQ0vlgUA7ZC0Qnvu1p_pfqrD-AIYSRw0fAweI0FBJJgt1n4yiwhdxjEwMBWxaAIUFS8Ixu1vMc&currency=USD"
      myPaypal.setAttribute("data-sdk-integration-source", "button-factory")
      document.head.appendChild(myPaypal)

      myPaypal.onload = function() {
        root.windowGlobal.paypal.Buttons({
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
                console.warn('Transaction completed by ' + details.payer.name.given_name + '!');
            });
          }
        }).render('#paypal-button-container')
      }
    }

    public showAboutDialogClick() {

      this.showAboutDialog = true
      this.createPayPalDonateButton()

    }

  }
</script>
