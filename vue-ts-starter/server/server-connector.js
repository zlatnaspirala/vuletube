
/**
 * Server part
 * @description Server based on nodejs.
 * - Protocol http2 - spdy
 * - Hosted on maximumroulette.com:3000
 */

 /**
  * @description Possible implementatiuon in future.
  *
  * var cors = require("cors")
  * var express = require("express")
  * var https = require('https')
  * var bodyParser = require("body-parser")
  * var app = express()
  * var compression = require("compression")
  **/

const spdy = require("spdy")
const path = require("path")
const port = 3000;
var fs = require("fs")
const youtubedl = require('youtube-dl')
const static = require('node-static')
var file = new (static.Server)(
  '/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/dist/')

var options = {
  key: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette.com.key"),
  cert: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt"),
  ca: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt")
};

var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    console.log('content-type:', res.headers['content-type'])
    console.log('content-length:', res.headers['content-length'])
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  });
};

var https = require('https').createServer(options, function(request, response) {

    request.addListener('end', function() {

      if (request.url.search(/.nidza|.dzoni/g) != -1) {

        // file.serveFile('bad.html', 402, {}, request, response);
        const localVid = request.url.split("?vid=")
        console.log("videoID => ", localVid[1])
        console.log("Vule bule request.url., ", request.url)
        const addressLink = 'http://www.youtube.com/watch?v=' + localVid[1]
        const checkvideo = '../dist/videos/vule' + localVid[1] + '.mp4'

        try {
          if (fs.existsSync(checkvideo)) {
            // file exists
            console.log("skip...")
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(`Not bad \n Man \n
                      Nikada nisam
                      Ja bio lud k'o sad \
                      Jer igru vule
                      Voli
                      svako mlad n\ "Tomi Sovilj i Njegove Siluete" `);
             return;
          }
        } catch(err) {
          console.error(err)
        }

          const myPromise = new Promise((resolve, reject) => {

            var test = youtubedl(addressLink, ['--format=18'], { cwd: __dirname })
            resolve(test)

          }).then((video) => {

            video.on('info', function(info) {
              console.log('Download started')
              console.log('filename: ' + info._filename)
              console.log('size: ' + info.size)
            })

            const videoName = '../dist/videos/vule' + localVid[1] + '.mp4';
            video.pipe(fs.createWriteStream(videoName, {
              flag: "w+"
            }))

          }
        ).catch(function(err) {
          reject()
          console.log("Error in promise", err)
        });

        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end(`VuleTube service \n
                      version 0.3.1 \n
                      https://maximumroulette.com:3000 `)

      } else  if (request.url.search(/.saveThumbnails/g) != -1) {

        let localImg = request.url.split("?imgs=");
        let testIMG = localImg[1].split(",")

        for (var j = 0; j < testIMG.length;j++) {
          /**
           * Prapare dynamic path for images
           * Format:
           * https://i.ytimg.com/vi/YPhJOC9-M_M/mqdefault.jpg
           */
          var trumbPath = 'https://i.ytimg.com/vi/' + testIMG[j] + '/mqdefault.jpg'
          if (testIMG[j] != '') {
            var oneTimeLocalFlag = true
            var dest = '../dist/assets/thumbnails/' + 'vule' + testIMG[j] + '.jpg'
            // check exist ....

            download(trumbPath, dest, () =>  {
              console.log('thumbnails downloaded.')
              if (oneTimeLocalFlag == true) {
                //
                response.writeHead(200, {'Content-Type': 'text/plain'})
                response.end(`VuleTube service \n
                              version 0.3.1 \n
                              https://maximumroulette.com:3000 `)
               }
            });
        }
      }

      } else {
        console.info("request.url => ", request.url)
        file.serve(request, response)
      }

    }).resume()

  }).listen(3000)
