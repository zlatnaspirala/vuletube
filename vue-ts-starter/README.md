
# VULETUBE web application #
### Project name: Vue project generator ###
##### First feature: YouTube vs Threejs #####
##### version 0.0.5 #####
##### Public access for VuleTube service: #####
##### https://maximumroulette.com:3000 #####

![vuletube](https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/vue-ts-starter/public/assets/vule-logo1.png)

Screenshot:
![screenshot](https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/screenshot.jpg)

YouTube presentation:
[youtube link](https://www.youtube.com/watch?v=-lwkKzFLzk0)

Production use `https` node application for web server.

 Clone whole project with submodules:

```js
  git clone --recurse-submodules https://github.com/zlatnaspirala/vue-typescript-starter
```

```bash
  npm i
```

  Other good solution is node `serve` for instant start.

Install:
```bash
  npm install -g serve
```

Run:
```node
  serve -s dist
  // or
  npm run serve
```

## Project details ##

  - Vue3 vs TS
  - Version: typescript 3.9.6
  - Visual Code Text Editor used.
  - NodeJS based backend part.

### Features Flow ###

Note:
```
  0.0.x => any changes
  0.x.1 ... n => any changes + updated present logic or new big feature.
  x.1.1 ... n => release git/build point version.
```

 <b>- version 0.0.2 [MASTER] </b>

  - Getting response for youtube search.
  - Call server part for saving videos

 <b>- version 0.0.3 [MASTER] </b>

  - Add options switch-place for two main components
  - Implement LocalStorageMemory class (For saving all
   user infly data - view options etc.)

 <b>- version 0.0.4 [MASTER] </b>

  - Save current (exist) options with localStorage and load on refresh.
  - Every next options will be implemented with localStorage support.

 <b>- version 0.0.5 [MASTER] </b>

  - Added new server module :
   `npm install --save image-downloader`
  - Prepare for search result preview in 3d.
   with raycast options for navigate.
   Add options for:
  - save result number per page - pagination.
  - show result in 3d

 <b> version 0.1.1 [MASTER] </b>

  - Adding progress for video duration.
  - Adding webcam options.
  - Replace text with icons.

 <b> version 0.1.2 [MASTER] </b>

  - Adding paypal donate buttons

  - test nui webcamer controller [DEV]
      - voice commander activate   => function0
      - information/about          => function7
      - switch theme               => function1

  - test nui/voice controller [DEV]
     Just basic - voice-commander need to be improved.

     Login proccess need mouse or touch event trigger.
     Can't be passed with nui or voice commander.

 Screenshot:
![screenshot](https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/screenshot.0.1.2.png)

 <b> version 0.1.3 [NEXT] </b>

  - Prevent raycast click event behind 3d plane video FIX@
  - test nui/voice controller [DEV]
     pre-command -> action command =>
     v-command : `search` or `search for` then listening for `what to search` .


### Production ###

 How to upload on production (windows):
  - Build on windows mashine host with `npm run build` then simple upload dist/ with
    ftp client to the public vps. Run in server/node `node server-connector.js`

 On top lever root folder of git project run =>
 `git submodule update --init --recursive`


### Project structure ###

<pre>

├── dist/  (This is auto generated)
├── node_modules/  (This is auto generated)
├── public/
|   ├── assets/
|   |   └── icons/
|   |   |   └── svgs
|   |   |   └── pngs
|   |   └── vule-logo1.png
|   |   └── logo.png
|   |   └── sounds/
|   |   |   └── note.mp3 ...
|   |   └── submodules/
|   |   |   └── nui-commander/
|   |   |   └── voice-commander/
|   ├── thumbnails/
|   ├── videos/
|   |   └── list.html
|   ├── bad.html
|   ├── favicon.ico
|   ├── index.html
├── server/
|   ├── node_modules/ (This is auto generated)
|   ├── package.json
|   ├── package-lock.json
|   ├── server-connector.js
├── src/
|   ├── components/
|   |   ├── nui-webcam-control/
|   |   |   ├── nui-webcam-control.vue
|   |   ├── youtube-3d/
|   |   |   ├── myYouTube.vue
|   |   |   └── webgl-player.vue
|   |   ├── myFooter.vue
|   |   ├── myHeader.vue
|   ├── my-common/
|   ├── local-storage/
|   ├── App.vue
|   └── styles/
|   |   └── styles.scss
|   ├── App.vue
|   ├── main.ts
|   ├── error-instance.ts
|   ├── shims-tsx.d.ts
|   ├── shims-vue.d.ts
|   └── store.ts
├── .gitignore
├── README.md (This file)
├── tsconfig.json
├── vue.config.js
├── package.json
├── package-lock.json (This is auto generated)
└── babel.config.js

</pre>

### Components : ###

 <b> - myYouTube.vue </b>
   Getting response for youtube search.
   Call server part for saving videos

 <b> - webgl-player.vue </b>
   Open opengles port view, look for
   video source saved to the maximumroulette:3000
   I use quick solution from npm:
   https://www.npmjs.com/package/youtube-dl


#### Response for youtube api v3 call `search`. ####

```js
  body: "{↵  "kind": "youtube#searchListResponse",↵  "etag""
  headers: {cache-control: "private", content-encoding: "gzip",
  content-length: "5512", content-type: "application/json; charset=UTF-8", date: "Sun, 05 Jul 2020 20:47:06 GMT", …}
  result: {
    kind: "youtube#searchListResponse",
    etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38",
    nextPageToken: "CBkQAA", regionCode: "RS", pageInfo: {…}, …}
  status: 200
  statusText: null
```

#### Result property: ####

```json
{
  "kind": "youtube#searchResult",
  "etag": "mlweRndBtBgAcVC-11ZrL0oI7ok",
  "id": {
    "kind": "youtube#video",
    "videoId": "YPhJOC9-M_M"
  },
  "snippet": {
  "publishedAt": "2019-07-14T19:27:31Z",
  "channelId": "UCc1NtMtvoVzKnOtnai9LGsA",
  "title": "Create game engine - Visual typescript game engine",
  "description": "Clone or download from : https://github.com/zlatnaspirala/visual-ts-game-engine Next video\
    developing in live - adding multiplayer feature. Project : Visual ts ...",
  "thumbnails": {
    "default": {
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/default.jpg",
      "width": 120, "height": 90
    },
    "medium": {
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/mqdefault.jpg",
      "width": 320, "height": 180
    },
    "high": {
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/hqdefault.jpg",
      "width": 480, "height": 360
    }
  },
  "channelTitle": "javascript fanatic",
  "liveBroadcastContent": "none",
  "publishTime": "2019-07-14T19:27:31Z"
  }
}

{
  etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38"
  items:
      etag: "mlweRndBtBgAcVC-11ZrL0oI7ok"
      id: {kind: "youtube#video", videoId: "YPhJOC9-M_M"}
      kind: "youtube#searchResult"
      snippet: {publis
      kind: "youtube#searchListResponse"
      nextPageToken: "CBkQAA"
      pageInfo: {totalResults: 400229, resultsPerPage: 25}
      regionCode: "RS"
      }
}

```

### VueMaterial help ###

 Notes :

 - All other `<input type="file">` attributes, such as multiple and accept, can be used on md-field.
 - Icons used with https://fontawesome.com/v4.7.0/icons/
 - eslint or any other cheker full strict only for proc build
   in dev status lint will pass more roles.

 - In public/assets/icons i added complete `fontawesome-free-5.14.0-web` package.



### About routes ###

From official:

```
Simple Routing From Scratch
If you only need very simple routing and do not wish to involve a full-featured router library,
you can do so by dynamically rendering a page-level component like this:

const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }

const routes = {
  '/': Home,
  '/about': About
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
```

### Spiral position ###

Not in use at the moment.

```js
  var count = 10;
  var radius = 32;
  for ( var i = 1, l = count; i <= l; i ++ ) {
    var phi = Math.acos( - 1 + ( 2 * i ) / l );
    var theta = Math.sqrt( l * Math.PI ) * phi;
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.setFromSphericalCoords( radius, phi, theta );
    mesh.lookAt( this.camera.position );
    this.scene.add( mesh );
  }
```

#### YT Download module ####

 Download from:
 https://www.npmjs.com/package/youtube-dl


### Private links: ###

  https://console.developers.google.com/apis/credentials?folder=&organizationId=&project=vue-project-generator
  https://console.developers.google.com/apis/library?filter=category:maps&project=vue-project-generator

### Help links/public ###

  https://vuematerial.io/themes/configuration
  https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md#LoadinganAPIandMakingaRequest
  https://developers.google.com/youtube/v3/docs/search/list?apix=true

## Direct link for dev server ##

### VueTube web DEV [WIP] service 2020 ###
https://maximumroulette.com:3000
