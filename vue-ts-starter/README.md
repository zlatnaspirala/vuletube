# vue-ts-starter #

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

### Components : ###

 - myYouTube.vue
   Getting response for youtube search.
   Call server part for saving videos

#### Response for youtube api v3 call. ####

```
  body: "{↵  "kind": "youtube#searchListResponse",↵  "etag""
  headers: {cache-control: "private", content-encoding: "gzip", content-length: "5512", content-type: "application/json; charset=UTF-8", date: "Sun, 05 Jul 2020 20:47:06 GMT", …}
  result: {kind: "youtube#searchListResponse", etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38", nextPageToken: "CBkQAA", regionCode: "RS", pageInfo: {…}, …}
  status: 200
  statusText: null
```

#### Result property: ####

```javascript
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
  "description": "Clone or download from : https://github.com/zlatnaspirala/visual-ts-game-engine Next video - \
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
```

#### YT Download module ####
 Download from :
 https://www.npmjs.com/package/youtube-dl


### Apache centos 7.5 setup renew ssl letsencrypt ###

```bash
sudo /usr/bin/letsencrypt --apache -d maximumroulette.com -d apps.maximumroulette.com -d kure.maximumroulette.com -d roulette.maximumroulette.com -d artificialintelligence.maximumroulette.com
```

### Private links: ###

  https://console.developers.google.com/apis/credentials?folder=&organizationId=&project=vue-project-generator
  https://console.developers.google.com/apis/library?filter=category:maps&project=vue-project-generator

### Help links/public ###

  https://vuematerial.io/themes/configuration
  https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md#LoadinganAPIandMakingaRequest
  https://developers.google.com/youtube/v3/docs/search/list?apix=true

