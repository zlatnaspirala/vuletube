
<template>

  <div>
    <md-button ref="ytfetch"
               @click="execute"
               v-show='tyfetchVisibility'>
                YT FETCH
    </md-button>
    Welcome to my youtube viewer.
    <input v-model="yts.total">
    <input v-model="yts.mySearchQuery">
  </div>

</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 24px;
  }
</style>

<script lang="ts">

  // Fix ts compiler.
  /*eslint no-unused-vars: 1*/
  declare var gapi: any;

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu, mdButton , mdIcon } from 'vue-material'
  import { VueConstructor } from 'vue/types/umd';

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon
    }
  })

  @Component
  export default class GoogleAccountLogin extends Vue {

    constructor() {
      super()
    }

    data() {
      return {
        yts: {
          total: 0,
          mySearchQuery: 'visula ts game engine'
        },
        isAuthorized: false,
        tyfetchVisibility:false
      }
    }

    methods() {
    }

    /*eslint  no-unused-labels: 1*/
    loginIn() {
        this.authenticate().then(this.loadClient)
    }

    currentApiRequest: any = {};

    private setNewResponse(r: any) {
      this.currentApiRequest = r
      console.log('What is response -> ', r)
    }

    mounted (): void {

      var root = this;
      let g = document.createElement('script')
      g.setAttribute('src', 'https://apis.google.com/js/api.js')
      document.head.appendChild(g)
      console.log('Access')
      if (typeof gapi === 'undefined') {
        setTimeout( () => {
          console.log('Object gapi:', gapi)
          root.start(gapi)
        } , 2000)
      } else {
        root.start(gapi)
      }

      this.$root.$on('googleApiLoginEvent',  function(this: typeof Vue, args: any) {
        try {
           console.info("Event googleApiLoginEvent => ", args)
           root.loginIn()
        } catch(err) {
          console.warn(err)
        }

      })

    }

    /**
     * Sample JavaScript code for youtube.search.list
     * See instructions for running APIs Explorer code samples locally:
     * https://developers.google.com/explorer-help/guides/code_samples#javascript
     */
    authenticate() {
      return gapi.auth2.getAuthInstance()
          .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
          .then(() => {

            console.log("Sign-in successful");
            this.$data.tyfetchVisibility = true
            this.$data.isAuthorized = true

          },
          function(err) {
            console.error("Error signing in", err);
          });
    }

    loadClient = () => {
      gapi.client.setApiKey("AIzaSyD0VfsO5ed64NM4kZ2ot834m6Xmjbt_wBQ");
      return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => {
          console.info('setApiKey gapi loaded.')
        },
        function(err) {
          console.error("Error loading GAPI client for API", err);
        });
    }

    // Make sure the client is loaded and sign-in is complete before calling this method.
    // If you use APiKey no need.
    execute() {
      console.log("start execute")
      var root = this

      return (gapi as any).client.youtube.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": 25,
        "q": root.$data.yts.mySearchQuery
      })
        .then((response) => {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response)
          this.setNewResponse(response)

        },
        function(err: any) { console.error("Execute error", err); });
    }

    private start(gapi: any) {

      gapi.load("client:auth2", function() {
        gapi.auth2.init({
          client_id: "556834814931-c7rlekih0gfdcf1gg7taiul6cfp57a1q.apps.googleusercontent.com"
        }).then (function(ee) {
          console.log('Passed...', ee)
        })
      })

    }

}
</script>
