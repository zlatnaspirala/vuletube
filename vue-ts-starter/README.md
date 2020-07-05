# vue-ts-starter #

  Production use `https` node application for web server.
  Other good solution is node `serve` for instant start.

  Install:
  ```bash
    npm install -g serve
  ```

  Run:
  ```bash
    serve -s dist
  ```

## Project details ##

Response for youtube api v3 call.

```
body: "{↵  "kind": "youtube#searchListResponse",↵  "etag""
headers: {cache-control: "private", content-encoding: "gzip", content-length: "5512", content-type: "application/json; charset=UTF-8", date: "Sun, 05 Jul 2020 20:47:06 GMT", …}
result: {kind: "youtube#searchListResponse", etag: "3nOm8AR0NU4TDlCxh0UCxk1KB38", nextPageToken: "CBkQAA", regionCode: "RS", pageInfo: {…}, …}
status: 200
statusText: null
```

### Apache centos 7.5 setup renew ssl letsencrypt ###
sudo /usr/bin/letsencrypt --apache -d maximumroulette.com -d apps.maximumroulette.com -d kure.maximumroulette.com -d roulette.maximumroulette.com -d artificialintelligence.maximumroulette.com

### Private links: ###

  https://console.developers.google.com/apis/credentials?folder=&organizationId=&project=vue-project-generator
  https://console.developers.google.com/apis/library?filter=category:maps&project=vue-project-generator

### Help links/public ###

  https://vuematerial.io/themes/configuration
  https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md#LoadinganAPIandMakingaRequest
  https://developers.google.com/youtube/v3/docs/search/list?apix=true

