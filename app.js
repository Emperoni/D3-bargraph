"use strict";

var http       = require('http'),
    port       = process.env.PORT || 8080,
    request    = require('request'), // assume this lets do calls to other files, like ajax.
    qs         = require('querystring'),
    util       = require('util'),
	express    = require('express'),
    mongoose   = require('mongoose'),
	path       = require('path'), // I think that I added this but it is not really needed.
    app        = express()

var db = mongoose.createConnection(
  'mongodb://dgraziani:Mpr$4meMP@proximus.modulusmongo.net:27017/enyrO4ma'
);
// set the global environment variable
var environment = process.env.NODE_ENV;
console.log(environment);
// Generic Express config
app.set('port', port)
//app.set('views', 'view')
app.use(express.static(__dirname + '/public'));
app.use('/model', express.static(__dirname + '/model'));
app.use('/view', express.static(__dirname + '/view'));
app.use('/controller', express.static(__dirname + '/controller'));
app.use(express.bodyParser())
app.use(express.cookieParser('daniele')) // what are these two lines?
app.use(express.session({secret: 'graziani'})); // pa we dis?
app.use(app.router)

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})

app.get('/', function(req, res) {
	
    let output = '<!DOCTYPE html><html lang="en"><head>';
	output += '</head><body><h1>D3 MVC Node.js App</h1>';
    output += `<a target="_blank" href="/appHome.html">d3.js bargraph home</a><br>`;	
	output += '</body></html>';
	res.send(output);
	
})

