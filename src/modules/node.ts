require('amdefine/intercept');
var tracer = require("./console-tracer");

tracer.trace("NODE Initialized", tracer.MessageType.Info);

var ftp = require("./ftp");
//"162.219.3.5"
var port = 21;
ftp.createServer("127.0.0.1").listen(port);
tracer.trace("FTP Listening on port " + port, tracer.MessageType.Info);