
<template>
  <div v-bind:style="styleObject">

    <div id="player" style="position:absolute;width:320px;right:0;" ></div>

    <md-field>
      <label>Search youtube bar:</label>

      <md-input color="md-primary"
              v-model="yts.mySearchQuery"
              class="md-primary md-raised"
              placeholder="Search youtube:"
              maxlength="1200">
              </md-input>
    </md-field>

    <md-button class="md-primary md-raised"
               ref="ytfetch"
               @click="execute"
               v-show='tyfetchVisibility'>
                 RUN FETCH
    </md-button>

    <md-table md-card v-show='tyfetchVisibility' >
      <md-table-toolbar>
        <md-chip> {{ yts.ytResponse.status }}</md-chip>
        <h1 class="md-title">YouTube results:</h1>
      </md-table-toolbar>
      <md-table-row :key="value" md-selectable="single"
          slot="md-table-row" :slot-scope="yts.ytResponse.result"
          v-for="value in yts.ytResponse.result.items">
        <md-table-cell @click="prepareThisVideo" md-label="VideoId" md-sort-by="VideoId" >
          {{ value.id.kind }} from <b> {{ value.snippet.channelTitle }} </b>
          data: <b> {{ value.snippet.publishTime.split("T")[0] }} </b>
        </md-table-cell>
        <md-table-cell md-label="Title" md-sort-by="title" >{{ value.snippet.title }}</md-table-cell>
        <md-table-cell md-label="VideoId" md-sort-by="videoId" >
          {{ value.id.videoId }} <br>
          <md-button class="md-primary md-raised"
               @click="prepareThisVideo"
               v-show='tyfetchVisibility'
               :data-videoid="value.id.videoId">
                 PLAY VIDEO
              </md-button>
          </md-table-cell>
        <md-table-cell md-label="Thumbnails" md-sort-by="thumbnails" >
            <md-card>
              <md-card-media>
                <img :src="value.snippet.thumbnails.medium.url" alt="medium size">
              </md-card-media>
            </md-card>
        </md-table-cell>
      </md-table-row>
    </md-table>
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
  import { mdMenu,
          mdField,
         mdButton,
           mdIcon,
           mdCard,
          mdInput
  } from 'vue-material'

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

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon,
      mdCard,
      mdInput,
      mdField
    }
  })

  @Component
  export default class myYouTube extends Vue {

    private styleObject = {};

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
              items: [],
            },
            status: 0
          },
          mySearchQuery: 'visula ts game engine'
        },
        isAuthorized: false,
        tyfetchVisibility:false,
        spaceHForYTComponet: window.innerHeight * 0.9 + 'px'
      }
    }

    /*eslint  no-unused-labels: 1*/
    private loginIn() {
        this.authenticate().then(this.loadClient)
    }

    justItems: {} = {}

    private prepareThisVideo(e) {

      var passVideoId = e.target.parentElement.parentElement.getAttribute("data-videoid")
      fetch('/dzoni?vid=' + passVideoId)
      .then(
        (response) => {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          console.log("I am look at response", response)
          /**
           * body: ReadableStream
           * bodyUsed: false
           * headers: Headers {}
           * ok: true
           * redirected: false
           * status: 200
           * statusText: "OK"
           * type: "basic"
           * url: "https://maximumroulette.com:3000/dzoni?vid=YPhJOC9-M_M"
           */
          var handler = response.url.split("?vid=")
          const passArgs = {
            videoId: handler[1]
          }
          this.$root.$emit('videoInProgress', { args: passArgs })
          // Examine the text in the response
          // response.json().then(function(data) {
            // console.log(data);
          // });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    }

    private setNewResponse(r: any) {
      // this.currentApiRequest = r
      this.$data.yts.ytResponse = r
      var items = r.result.items

      for ( var x = 0; x < items.length; x++) {
        this.$set(this.$data.yts.ytResponse.result.items, x, items[x])
        this.$set(this.justItems, items[x].id.videoId, items[x].id.videoId)
      }

      // console.log('What is better we will se -> ', this.currentApiRequest)
    }

    private mounted (): void {

     this.styleObject = {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        height: this.$data.spaceHForYTComponet,
        width: '100%',
        border: 'solid blue 1px'
      }

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

      window.addEventListener('resize', () => {
        // console.log("test resize window.innerHeight ", window.innerHeight)
        this.$set(this, "spaceHForYTComponet", window.innerHeight)
      })

      this.loadStartUpVideo()

    }

    private loadStartUpVideo() {
      var YT;
      var tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)

      var player;
      /* eslint no-unused-vars: 1 */
      (window as any).onYouTubeIframeAPIReady = function() {

        console.log('onPlayerReady  -> ', onPlayerReady)
        player = new (window as any).YT.Player('player', {
          height: '195',
          width: '320',
          videoId: 'M7lc1UVf-VE', // TOdo7dhvSwg Mr k
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      function onPlayerReady(event) {
        event.target.playVideo();
      }

      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }

      function stopVideo() {
        player.stopVideo();
      }
    }

    private authenticate() {
      return gapi.auth2.getAuthInstance()
          .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
          .then(() => {
            this.$data.tyfetchVisibility = true
            this.$data.isAuthorized = true
            console.info("Sign-in successful");
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

    private execute() {

      var root = this
      return (gapi as any).client.youtube.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": 25,
        "q": root.$data.yts.mySearchQuery
      })
        .then((response) => {
          console.log("Response", response)
          this.setNewResponse(response)
        },
        function(err: any) {
          console.error("Execute error", err);
        });
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
