
<template>
  <div v-bind:style="styleObject">
    <div id="player" style="position:absolute;width:320px;right:0;"></div>
    <md-button class="md-primary md-raised" @click="showDialog = true">VIEW OPTIONS</md-button>
    <md-field>
      <label>Search youtube bar:</label>
      <md-input
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
    <md-table v-bind:style="styleTableObject" md-card v-show='tyfetchVisibility' >
      <md-table-toolbar>
        <h2 class="md-title">YouTube results:</h2>
      </md-table-toolbar>
      <md-table-row :key="value" md-selectable="single"
          slot="md-table-row" :slot-scope="yts.ytResponse.result"
          v-for="value in yts.ytResponse.result.items">
        <md-table-cell v-show="ytListVisibilityRowChannelTitle" @click="prepareThisVideo" md-label="VideoId" md-sort-by="VideoId" >
          {{ value.id.kind }} from <b> {{ value.snippet.channelTitle }} </b>
          data: <b> {{ value.snippet.publishTime.split("T")[0] }} </b>
        </md-table-cell>
        <md-table-cell v-show="ytListVisibilityRowTitle" md-label="Title" md-sort-by="title" >{{ value.snippet.title }}</md-table-cell>
        <md-table-cell v-show="ytListVisibilityRowVideoID" md-label="VideoId" md-sort-by="videoId">
          {{ value.id.videoId }} <br>
          <md-button class="md-primary md-raised"
               @click="prepareThisVideo"
               :data-videoid="value.id.videoId">
                 PLAY VIDEO
              </md-button>
          </md-table-cell>
        <md-table-cell v-show="ytListVisibilityRowThumbnails" md-label="Thumbnails" md-sort-by="thumbnails" >
            <md-card>
              <md-card-media>
                <img :src="value.snippet.thumbnails.medium.url" alt="medium size">
              </md-card-media>
            </md-card>
        </md-table-cell>
      </md-table-row >
    </md-table>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>LIST SETTINGS</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="YT SEARCH LIST OPTIONS">
          <md-content class="md-scrollbar md-content-options">
            <h3>Visibility:</h3>
            <md-content v-bind:style="optionsStyle">
              <md-switch class="md-primary md-raised"  v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowChannelTitle">Channel Title</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowTitle">Title</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowVideoID">Video ID</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowThumbnails">Thumbnails</md-switch>
            </md-content>
          </md-content>
        </md-tab>
      </md-tabs>

      <md-dialog-actions>
        <md-button color="md-primary" @click="showDialog = false">HIDE</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<style lang="scss" scoped>

  .md-menu {
    margin: 24px;
  }

  .md-content {
    width: 100%;
  }

  .md-content-options {
    padding: 25px 25px 25px 25px;
   -webkit-box-shadow: 1px 1px 5px 5px rgba(0,0,0,0.75);
   -moz-box-shadow: 2px 2px 5px 5px rgba(0,0,0,0.75);
    box-shadow: 2px 2px 5px 5px rgba(0,0,0,0.75);
  }

</style>

<script lang="ts">

  /*eslint no-unused-vars: 0*/
  declare var gapi: any;

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { mdMenu,
         mdButton,
           mdIcon,
           mdCard,
          mdInput,
          mdField,
          mdContent
  } from 'vue-material'

  /**
   * @description Enumerators:
   *               YTITEM_ENUM for YTItem
   *               YTRESULT_ENUM for YTResult
   */

  // eslint-disable-next-line
  enum YTITEM_ENUM {
    KIND = "youtube#searchResult",
    ID_KIND = "youtube#video"
  }

  // eslint-disable-next-line
  enum YTRESULT_ENUM {
    KIND = "youtube#searchListResponse"
  }

  const CompProps = Vue.extend({
    props: {
      options: Object
    }
  });

  /**
   * Best way is to create interface for
   * youtube api call details.
   */
  interface YTItem {
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
    items: YTItem[]
    kind:  string
    nextPageToken: string
    pageInfo: {
      totalResults: number
      resultsPerPage: number
    }
    regionCode: string
  }

  interface TYResponse {
    body: any
    headers: any
    result: YTResult
    status: number
    statusText: any
  }

  // Register for components
  @Component({
    components: {
      mdButton,
      mdMenu,
      mdIcon,
      mdCard,
      mdInput,
      mdField,
      mdContent
    }
  })

  @Component
  export default class myYouTube extends CompProps {

    private styleObject: Object = {}
    private showDialog: boolean = false

    private optionsStyle = {
      display: 'flex',
      width: '100%',
      paddingBottom: '10px',
      textAlign: 'center',
      itemsAlign: 'left',
      height: '30px'
    }

    private styleTableObject = {
      width: '100%'
    }

    constructor() {
      super()
    }

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
          mySearchQuery: 'visual ts game engine'
        },
        isAuthorized: false,
        tyfetchVisibility:false,
        ytListVisibilityRowChannelTitle: false,
        ytListVisibilityRowTitle: false,
        ytListVisibilityRowVideoID: true,
        ytListVisibilityRowThumbnails: true,
        spaceHForYTComponet: window.innerHeight * 0.9 + 'px'
      }
    }

    /*eslint  no-unused-labels: 1*/
    private loginIn() {
      this.authenticate().then(this.loadClient)
    }

    private justItems: {} = {}

    private prepareThisVideo(e) {

      var passVideoId = e.target.parentElement.parentElement.getAttribute("data-videoid")
      fetch('/dzoni?vid=' + passVideoId)
      .then(
        (response) => {

          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code:' +
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
          this.$root.$emit('videoInProgress', passArgs)
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
      var items = r.result.items as YTItem[]

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
        paddingLeft: '6px',
        paddingRight: '6px'
      }

      var root = this
      let g = document.createElement('script')
      g.setAttribute('src', 'https://apis.google.com/js/api.js')
      document.head.appendChild(g)

      if (typeof gapi === 'undefined') {
        setTimeout( () => {
          console.log('Object gapi:', gapi)
          root.start(gapi)
        } , 2500)
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
        // Bug
        // console.log("test resize window.innerHeight ", window.innerHeight)
        this.$set(this, "spaceHForYTComponet", window.innerHeight * 0.9)
      })

      // this.loadStartUpVideo()

    }

    private loadStartUpVideo() {
      /* eslint no-unused-vars: 0 */
      // var YT;
      var tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)

      var player;
      (window as any).player = player = {};


      /* eslint no-unused-vars: 1 */
      (window as any).onYouTubeIframeAPIReady = function() {

      var done = false;

        console.log('onPlayerReady')
          player = new (window as any).YT.Player('player', {
          height: '195',
          width: '320',
          videoId: 'M7lc1UVf-VE', // TOdo7dhvSwg Mr k
          events: {
            'onReady': (event) => {
             event.target.playVideo();
            },
            'onStateChange': (event) => {
            if (event.data == (window as any).YT.PlayerState.PLAYING && !done) {
              setTimeout(() => {
                player.stopVideo();
              }, 6000);
              done = true;
            }
      }
          }
        });
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
