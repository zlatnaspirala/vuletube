
<template>

  <div >

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
  import { Prop } from 'vue-property-decorator';

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

    // @Prop() slogan: string

    constructor() {
      super()
    }

    start(gapi) {
      // Initializes the client with the API key and the Translate API.
      gapi.client.init({
        'apiKey': 'YOUR_API_KEY',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
      }).then(function() {
        // Executes an API request, and returns a Promise.
        // The method name `language.translations.list` comes from the API discovery.
        return gapi.client.language.translations.list({
          q: 'hello world',
          source: 'en',
          target: 'de',
        });
      }).then(function(response) {
        console.log(response.result.data.translations[0].translatedText);
      }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
      })
    }

    mounted (): void {
      let g = document.createElement('script')
      g.setAttribute('src', 'https://apis.google.com/js/api.js')
      document.head.appendChild(g)
      console.log('Access props vars: ' + this.$props.slogan)
      if (typeof window.gapi === 'undefined') {

      }
      this.start(window.gapi);
    }

  }
</script>
