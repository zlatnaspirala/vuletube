
<template>

  <div>
    <md-button ref="ytfetch"
               @click="execute"
               v-show='tyfetchVisibility'>
                YT FETCH
    </md-button>

    length1 ..... {{ currentApiRequest.result.items.length }}
    length2 ..... {{ yts.ytResponse.result.items.length }}

    <div :key="value"
         v-for="value in justItems">

          {{ value }}

    </div>

    Welcome to my youtube viewer.
    <input v-model="yts.mySearchQuery">

  </div>

</template>

<style lang="scss" scoped>
  .md-menu {
    margin: 24px;
  }
</style>

<script lang="ts">

  /*eslint no-unused-vars: 1*/
  declare var gapi: any;

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu, mdButton , mdIcon } from 'vue-material'

  /**
   * Best way is to create interface for
   * youtube api call details.
   */
  interface TYItem {
    etag: string
    id: {
      kind: string
      videoId: string
    }
    kind: string
    snippet: any
  }

  interface YTResult {
    etag: string
    items: any[]
    kind:  string // "youtube#searchListResponse"  create enum in future
    nextPageToken: string // "CBkQAA"  create enum in future
    pageInfo: {
      totalResults: number
      resultsPerPage: number
    }
    regionCode: string // "RS"  create enum in future
  }

  interface TYResponse {
    body: any
    headers: any
    result: YTResult
    status: number // 200 create enum in future
    statusText: any // null
  }

   /**
    * body: "{↵  "kind": "youtube#searchListResponse",↵  "etag""
    * headers: {cache-control: "private", content-encoding: "gzip", content-length: "5512", content-type: "application/json; charset=UTF-8", date: "Sun, 05 Jul 2020 20:47:06 GMT", …}
    * result: {kind: "youtube#searchListResponse", etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38", nextPageToken: "CBkQAA", regionCode: "RS", pageInfo: {…}, …}
    * status: 200
    * statusText: null
    */

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon
    }
  })

  @Component
  export default class myYouTube extends Vue {

    constructor() {
      super()
    }

    /**
     * etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38"
     * items:
     *
     *    etag: "mlweRndBtBgAcVC-11ZrL0oI7ok"
     *    id: {kind: "youtube#video", videoId: "YPhJOC9-M_M"}
     *    kind: "youtube#searchResult"
     *    snippet: {publis
     *    kind: "youtube#searchListResponse"
     *    nextPageToken: "CBkQAA"
     *    pageInfo: {totalResults: 400229, resultsPerPage: 25}
     *    regionCode: "RS"
     */

    /**
     * Fix initial undefined model
     */
    data() {
      return {
        yts: {
          ytResponse: {
            result: {
              items: [
                {
                  id: {
                    kind: "blabal",
                    videoId: "qm55ljwNCAo"
                  }
                }
              ],
            }
          },
          mySearchQuery: 'visula ts game engine'
        },
        isAuthorized: false,
        tyfetchVisibility:false
      }
    }

    /*eslint  no-unused-labels: 1*/
    private loginIn() {
        this.authenticate().then(this.loadClient)
    }

    currentApiRequest: any =  {
      result: {
        items: [
          {
            id: {
              kind: "blabal",
              videoId: "qm55ljwNCAo"
            }
          }
        ],
      }
    }

    justItems: {} = {
      qmTTTTTTT: "qmTTTTTTT"
    }

    public computed = {
      // a computed getter
    }

    private setNewResponse(r: any) {
      // this.currentApiRequest = r
      this.$data.yts.ytResponse = r
      var items = r.result.items

      for ( var x = 0; x < items.length; x++) {
        this.currentApiRequest.result.items.push(items[x])
        this.$set(this.currentApiRequest.result.items[x], "id", items[x].id.videoId)
        this.$set(this.$data.yts.ytResponse.result.items, x, items[x])
        this.$set(this.justItems, items[x].id.videoId, items[x].id.videoId)
      }

      // console.log('What is better we will se -> ', this.currentApiRequest)

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
    private authenticate() {
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

    private loadClient = () => {
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
    private execute() {
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
