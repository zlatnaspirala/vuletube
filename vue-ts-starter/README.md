# vue-ts-starter #
## Project name: Vue project generator ##

## First feature: YouTube vs Threejs ##
### Public access for VuleTube service: ###
### https://maximumroulette.com:3000 ###
![vuletube](https://github.com/zlatnaspirala/vue-typescript-starter/blob/master/vue-ts-starter/src/assets/vule-logo1.png)

  Production use `https` node application for web server.

```bash
  git clone https://github.com/zlatnaspirala/vue-typescript-starter
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

### Project structure ###

<pre>

├── dist/  (This is auto generated)
├── node_modules/  (This is auto generated)
├── public/
|   ├── videos/
|       ├── list.html
|   ├── bad.html
|   ├── favicon.ico
|   ├── index.html
├── server/
|   ├── node_modules/ (This is auto generated)
|   ├── package.json
|   ├── package-lock.json
|   ├── server-connector.js
├── src/
|   ├── assets/
|   |   ├── logo.png
|   ├── components/
|   |   ├── youtube-3d/
|   |   |   ├── myYouTube.vue
|   |   |   └── webgl-player.vue
|   |   ├── myFooter.vue
|   |   ├── myHeader.vue
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
├── package.json
├── package-lock.json (This is auto generated)
└── babel.config.js

</pre>

### Components : ###

 - myYouTube.vue
   Getting response for youtube search.
   Call server part for saving videos

 - webgl-player.vue
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
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/default.jpg", "width": 120, "height": 90
    },
    "medium": {
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/mqdefault.jpg", "width": 320, "height": 180
    },
    "high": {
      "url": "https://i.ytimg.com/vi/YPhJOC9-M_M/hqdefault.jpg", "width": 480, "height": 360
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

 All other `<input type="file">` attributes, such as multiple and accept, can be used on md-field.

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

### VueTube web service 2020 ###
https://maximumroulette.com:3000
