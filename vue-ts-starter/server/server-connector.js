
// Protocol http2
const spdy = require("spdy");
const path = require("path");
const port = 3000;
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var https = require('https');
var bodyParser = require("body-parser");
var app = express();
var compression = require("compression");
const static = require('node-static');
var file = new (static.Server)('/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/dist/');
var basePath = '/var/www/html/applications/vue-project/vue-typescript-starter/vue-ts-starter/dist/';

var options = {
  key: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette.com.key"),
  cert: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt"),
  ca: fs.readFileSync("/etc/httpd/conf/ssl/maximumroulette_com.crt")
};

  httpRtc = require('https').createServer(options, function(request, response) {

    request.addListener('end', function() {

      if (request.url.search(/.png|.gif|.js|.css/g) != -1) {
        file.serveFile('bad.html', 402, {}, request, response);
      } else { file.serve(request, response); }

    }).resume();

  }).listen(3000);
