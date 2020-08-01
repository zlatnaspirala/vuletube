
<template>
  <div v-bind:style="styleObject">
    <div id="player" style="position:absolute;width:320px;right:0;"></div>
    <md-button class="md-primary md-raised" @click="showDialog = true">
      <md-icon class="fa fa-cog"></md-icon>
    </md-button>
    <md-field class="md-content-options">
      <label class="labelText" >Search youtube bar:</label>
      <md-input
              @keyup.enter="execute()"
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
                 SEARCH
    </md-button>
    <md-table v-bind:style="styleTableObject" md-card v-show='tyfetchVisibility' >
      <md-table-toolbar>
        <h2 class="md-title">YouTube results:</h2>
      </md-table-toolbar>
      <md-table-row :key="value" md-selectable="single"
          slot="md-table-row" :slot-scope="yts.ytResponse.result"
          v-for="value in yts.ytResponse.result.items">
        <md-table-cell v-show="ytListVisibilityRowChannelTitle" md-label="VideoId" md-sort-by="VideoId" >
          <div @click="prepareThisVideo" :data-videoid="value.id.videoId">
            {{ value.id.kind }} from <b> {{ value.snippet.channelTitle }} </b>
            data: <b> {{ value.snippet.publishTime.split("T")[0] }} </b>
          </div>
        </md-table-cell>
        <md-table-cell v-show="ytListVisibilityRowTitle"
                 md-label="Title"
                 md-sort-by="title" >
                 <div @click="prepareThisVideo" :data-videoid="value.id.videoId">
                   {{ value.snippet.title }}
                 </div>
        </md-table-cell>
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
                <div @click="prepareThisVideo" :data-videoid="value.id.videoId">
                  <img :src="value.snippet.thumbnails.medium.url" alt="medium size">
                </div>
              </md-card-media>
            </md-card>
        </md-table-cell>
      </md-table-row >
    </md-table>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>LIST SETTINGS</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="VISIBILITY">
          <md-content class="md-scrollbar md-content-options">
            <h3>Visibility:</h3>
            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="channelTitleOptionsChanged" class="md-primary md-raised"  v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowChannelTitle">Channel Title</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="titleOptionsChanged" class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowTitle">Title</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="videoIdOptionsChanged" class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowVideoID">Video ID</md-switch>
            </md-content>
            <md-content v-bind:style="optionsStyle">
              <md-switch v-on:change="thumbnailsOptionsChanged" class="md-primary md-raised" v-bind:style="optionsStyle"
                         v-model="ytListVisibilityRowThumbnails">Thumbnails</md-switch>
            </md-content>
          </md-content>
        </md-tab>
        <md-tab md-label="SCREEN SPLIT">
          <md-content class="md-scrollbar md-content-options">
            <div>
              RESIZE VIEWS <br>
              <input :oninput="setupCompWidth()" min="25" max="100" v-bind:style="{ width: '100%' }"  type="range" v-model.number="componentWidthOptions"> {{ componentWidthOptions }}%
            </div>
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
   -webkit-box-shadow: 0px 0px 3px 3px rgba(0,0,0,0.75);
   -moz-box-shadow: 0px 0px 3px 3px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 3px 3px rgba(0,0,0,0.75);
  }

  .labelText {
    padding-top: 5px;
    padding-left: 5px;
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

  import LocalStorageMemory from '../../local-storage/local-storage';

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
      arg: Object,
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

    private showDialog: boolean = false
    private styleObject: Partial<CSSStyleDeclaration> = {}
    private optionsStyle: Partial<CSSStyleDeclaration> = {
      display: 'flex',
      width: '100%',
      paddingBottom: '10px',
      textAlign: 'center',
      height: '30px'
    }
    private styleTableObject: Partial<CSSStyleDeclaration> = {
      width: '100%',
      height: '76%'
    }
    private ls: LocalStorageMemory = new LocalStorageMemory()

    constructor() {
      super()
      console.log('construction')
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
        ytListVisibilityRowChannelTitle: Boolean(this.$props.arg.options.searchBox.visibilityChannelTitle),
        ytListVisibilityRowTitle:  Boolean(this.$props.arg.options.searchBox.visibilityTitle),
        ytListVisibilityRowVideoID:  Boolean(this.$props.arg.options.searchBox.visibilityVideoId),
        ytListVisibilityRowThumbnails:  Boolean(this.$props.arg.options.searchBox.visibilityThumbnails),
        spaceHForYTComponet: window.innerHeight * 0.9 + 'px',
        componentWidthOptions: this.$props.arg.options.searchBox.width
      }
    }

    private channelTitleOptionsChanged(): void {
      this.ls.save("o_searchbox_visibility_channel_title", this.$data.ytListVisibilityRowChannelTitle.toString())
    }

    private titleOptionsChanged(): void {
      this.ls.save("o_searchbox_visibility_title", this.$data.ytListVisibilityRowTitle.toString())
    }

    private videoIdOptionsChanged(): void {
      this.ls.save("o_searchbox_visibility_videoid", this.$data.ytListVisibilityRowVideoID.toString())
    }

    private thumbnailsOptionsChanged(): void {
      this.ls.save("o_searchbox_visibility_thumbnails", this.$data.ytListVisibilityRowThumbnails.toString())
    }

    private setupCompWidth() {
      this.$root.$emit('reziseCanvas');
      this.styleObject.width = this.$data.componentWidthOptions + '%'
      this.ls.save("o_searchbox_width", this.$data.componentWidthOptions)
    }

    /*eslint  no-unused-labels: 1*/
    private loginIn(): void {
      this.authenticate().then(this.loadClient)
    }

    // private justItems: {} = {}

    private prepareThisVideo(e) {

      var passVideoId = e.target.parentElement.parentElement.getAttribute("data-videoid")
      if (typeof passVideoId === 'undefined' || passVideoId === null) {
        passVideoId = e.currentTarget.getAttribute("data-videoid")
      }
      console.log("DEVpassVideoId ", passVideoId)

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
        }
      )
      .catch(function(err) {
        console.error('Fetch Error => ', err);
      });
    }

    private setNewResponse(r: any) {

      this.$data.yts.ytResponse = r
      var items = r.result.items as YTItem[]
      this.$store.commit('saveResponse', { items: items })
      this.$root.$emit('ytItemsReady', { items: items })

      for ( var x = 0; x < items.length; x++) {
        this.$set(this.$data.yts.ytResponse.result.items, x, items[x])
        // this.$set(this.justItems, items[x].id.videoId, items[x].id.videoId)
      }
    }

    private mounted (): void {

      this.styleObject = {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        height: this.$data.spaceHForYTComponet,
        paddingLeft: '6px',
        paddingRight: '6px',
        width: '50%'
      }

      var root = this
      let g = document.createElement('script')
      g.setAttribute('src', 'https://apis.google.com/js/api.js')
      document.head.appendChild(g)

      if (typeof gapi === 'undefined') {
        setTimeout( () => {
          // console.log('Object gapi:', gapi)
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
        this.$set(this, "spaceHForYTComponet", window.innerHeight * 0.85)
      })

      // this.loadStartUpVideo()

    }

    private loadStartUpVideo() {
      /* eslint no-unused-vars: 0 */
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
          videoId: 'M7lc1UVf-VE',
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
        })
      }
    }

    private authenticate(): any {
      return gapi.auth2.getAuthInstance()
          .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
          .then(() => {
            this.$data.tyfetchVisibility = true
            this.$data.isAuthorized = true
            console.info("Sign-in successful");
          },
          function(err) {
            console.error("Error signing in => ", err);
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

    private execute(): void {

      var root = this
      return (gapi as any).client.youtube.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": root.ls.load("o_webglbox_preview_per_page"),
        "q": root.$data.yts.mySearchQuery
      })
        .then((response) => {
          console.log("Response", response)
          this.setNewResponse(response)
        },
        function(err: any) {
          console.error("Execute error for client.youtube.search.list => ", err)
        })
    }

    private start(gapi: any): void {

      gapi.load("client:auth2", () => {
        gapi.auth2.init({
          client_id: "556834814931-c7rlekih0gfdcf1gg7taiul6cfp57a1q.apps.googleusercontent.com"
        }).then (() => {
          console.info("Gapi is ready => " + gapi.auth2.init)
        }).catch((err) => {
          console.warn("Error in start func.", err)
        })
      })

    }

}
</script>
