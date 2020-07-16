
// Protocol http2
const spdy = require("spdy");
const path = require("path");
const port = 3000;
var cors = require("cors");
var express = require("express");
var fs = require("fs");
const youtubedl = require('youtube-dl');
var https = require('https');
var bodyParser = require("body-parser");
var app = express();
var compression = require("compression");
const static = require('node-static');
var file = new (static.Server)('/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/dist/');
var videoAccess = new (static.Server)('/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/server/videos/');
var basePath = '/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/dist/';

var options = {
  key: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette.com.key"),
  cert: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt"),
  ca: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt")
};

var httpRtc = require('https').createServer(options, function(request, response) {

    request.addListener('end', function() {

      if (request.url.search(/.nidza|.dzoni/g) != -1) {
        // file.serveFile('bad.html', 402, {}, request, response);
        console.log("Vule bule request.url., ", request.url);
        const localVid = request.url.split("?vid=");
        console.log("videoID => ", localVid[1]);
        const addressLink = 'http://www.youtube.com/watch?v=' + localVid[1];
        const video = youtubedl(addressLink,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname })

        // Will be called when the download starts.
        video.on('info', function(info) {
          console.log('Download started')
          console.log('filename: ' + info._filename)
          console.log('size: ' + info.size)
        })

        const videoName = 'videos/vule' + localVid[1] + '.mp4';
        video.pipe(fs.createWriteStream(videoName))

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end(`Not bad \n Man \n
                      Nikada nisam
                      Ja bio lud k'o sad \
                      Jer igru vule
                      Voli
                      svako mlad n\ "Tomi Sovilj i Njegove Siluete" `);

      } else if (request.url.search(/.videos/g) != -1) {
        console.log("Special call => ",  request.url);
        var h = request.url.replace("/?videos", "");
        console.log("Special mod on server only => ",  request.url);
        videoAccess.serve(h, response);
      } else {
        console.log("Client looks at request.url ",  request.url);
        file.serve(request, response);
      }

    }).resume();

  }).listen(3000);
