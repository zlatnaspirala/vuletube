
<template>

  <div>
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
        }
      }
    }

    methods() {
      /*eslint  no-unused-labels: 1*/
      loginIn: () => {
        this.authenticate().then(this.loadClient)
      }
    }



    isAuthorized: boolean = false;
    currentApiRequest: any = {};

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
      }

      this.$root.$on('googleApiLoginEvent',  function(this: typeof VueComponent, args: any) {
        console.log("GOOD - args ", args)
        try {
           console.log("GOOD - args ", this)
           // this.$children[0].$refs.GoogleAccountLoginRef.loginIn()
           // this.$refs.GoogleAccountLogin.loginIn()
        } catch(e) {
          console.log(e)
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
          .then(function() {
            console.log("Sign-in successful");
          },
          function(err) {
            console.error("Error signing in", err);
          });
    }

    loadClient() {
      // gapi.client.setClientId("556834814931-c7rlekih0gfdcf1gg7taiul6cfp57a1q.apps.googleusercontent.com");
      gapi.client.setApiKey("AIzaSyD0VfsO5ed64NM4kZ2ot834m6Xmjbt_wBQ");
      return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() {
          console.log("GAPI client loaded for API");
        },
        function(err) {
          console.error("Error loading GAPI client for API", err);
        });
    }

    // Make sure the client is loaded and sign-in is complete before calling this method.
    // If you use APiKey no need.
    execute() {
      var root = this

      return (gapi as any).client.youtube.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": 25,
        "q": root.$data.yts.mySearchQuery
      })
        .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function(err: any) { console.error("Execute error", err); });
    }

    start(gapi: any) {

      console.log("start")
      gapi.load("client:auth2", function() {
        gapi.auth2.init({
          client_id: "556834814931-c7rlekih0gfdcf1gg7taiul6cfp57a1q.apps.googleusercontent.com"
        })
      })

    }

}
</script>
