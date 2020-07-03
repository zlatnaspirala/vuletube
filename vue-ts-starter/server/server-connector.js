
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
// express.compress()
app.use(compression({
  filter: function () { return true; }
}));

// Server configuration
// app.use(express.static(__dirname + "../dist-test")); // Set the static files location
// app.use(cors());

app.get("*", (req, res) => {

   if(req.secure) {
    // OK, continue
    console.log("I got request from client ..SECURE !!.", req);
  };

  console.log("I got request from client ...", req);
  // Test native cors,
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Accept-Encoding', 'deflate, gzip;q=1.0, *;q=0.5');
  res.header('Cache-Control', 'public, max-age=31557600');

  // res.redirect('https://' + req.headers.host + req.url);
  res.status(200).json({ message: "ok" });

});

// app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}


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
