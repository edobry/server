var http = require("http");

var server = http.createServer(function(req, res) {
	res.write("test");
}).listen(80);