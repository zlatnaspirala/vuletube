
<template>

  <div >
    <button v-on:click="loginIn">authorize and load</button>
    <button v-on:click="execute">execute</button>
  </div>

</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 24px;
  }
</style>

<script lang="ts">
  /* global gapi */
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu, mdButton , mdIcon } from 'vue-material'
  // import { Prop } from 'vue-property-decorator';

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

    isAuthorized: boolean = false;
    currentApiRequest: any = {};

    mounted (): void {

      var root = this;
      let g = document.createElement('script')
      // "https://apis.google.com/js/api.js
      g.setAttribute('src', 'https://apis.google.com/js/api.js')
      document.head.appendChild(g)
      console.log('Access')
      if (typeof gapi === 'undefined') {
        console.log('BAD')
        setTimeout( () => { root.start(window.gapi) } , 2000)
      }

    }

  loginIn() {
    this.authenticate().then(this.loadClient)
  }

  /**
   * Sample JavaScript code for youtube.search.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }

  loadClient() {
    gapi.client.setApiKey("AIzaSyD0VfsO5ed64NM4kZ2ot834m6Xmjbt_wBQ");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

  // Make sure the client is loaded and sign-in is complete before calling this method.
  execute() {
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": 25,
      "q": "surfing"
    })
      .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
      function(err) { console.error("Execute error", err); });
  }

  start(gapi) {

    console.log("start")
    gapi.load("client:auth2", function() {
      gapi.auth2.init({client_id: "AIzaSyD0VfsO5ed64NM4kZ2ot834m6Xmjbt_wBQ"});
    });

  }

}
</script>
