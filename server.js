var cc       = require('config-multipaas'),
    fs       = require('fs'),
    http     = require("http"),
    st       = require("st"),
    os       = require("os"),
    Router   = require("routes-router"),
    sendJson = require("send-data/json"),
    sendHtml = require("send-data/html"),
    sendError= require("send-data/error")

var config   = cc().add({ VERSION: process.env.RELEASE_VERSION || "1.0" })
var app      = Router()

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}")
})

app.addRoute("/", function (req, res, opts, cb) {
  //var data = fs.readFileSync(__dirname + '/index.html');
  
  // Find the container's internal IP address
  var version = config.get('VERSION');
  var pod_ip = config.get('IP');
  for( x in os.networkInterfaces() ){ pod_ip = os.networkInterfaces()[x][0].address;}

  var data = "release version: " + version +", internal IP: " + pod_ip;
  sendHtml(req, res, {
    body: data.toString(),
    statusCode: 200,
    headers: {}
  })
})

// Serve all the static assets prefixed at /static
// so GET /js/app.js will work.
app.addRoute("/*", st({
  path: __dirname + "/static",
  url: "/"
}))

var server = http.createServer(app)
server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
