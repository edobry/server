///<reference path="../../typings/reference.ts" />
/// <reference path="../../typings/tracer.d.ts" />

var sys = require("sys");
var tcp = require("tcp");
//var posix = require("posix");
var file = require("file");

var f = require("./f");
var router = require("./router");
var tracer = require("./console-tracer");

interface FileSystem {
    chdir(dir: string): string;
    cwd(): string;
    open(filename: string, mode: string, cb: {(err: Object, fd: Object):any;}): any;
};

export var createServer = (host) => {
    var fs: FileSystem = require("./dummyfs");

    var server = tcp.createServer(function(socket) {
    	socket.setTimeout(0);
        socket.setNoDelay();

        socket.passive = false;
        socket.pasvport = 0;
        socket.pasvaddress = "";
        socket.mode = "ascii";
        socket.filefrom = "";
        socket.username = "";
        socket.datatransfer = null;
        socket.totsize = 0;
        socket.filename = "";

        var routes = {
            "CDUP": () => {
            	//change to parent directory
            	var parentDir = fs.chdir("..");
            	socket.send("250 Directory changed to " + parentDir + "\r\n"); 
            },
            "CWD": (directory) => {
                //change working directory
            	var newDir = fs.chdir(directory);

                socket.send("250 CWD successful. \"" + newDir + "\" is current directory\r\n");
            },
            "DELE": (filename) => {
                var rn = sys.exec("rm -f " + fs.cwd() + filename);
                rn.addCallback((stdout, stderr) => 
                    socket.send("250 file deleted\r\n")
                );
                rn.addErrback(() => socket.send("250 file deleted\r\n"));
            },
            "FEAT": () => {
                socket.send("211-Features\r\n");
                socket.send(" SIZE\r\n");
                socket.send("211 end\r\n");
            },
            "LIST": () => {
                socket.datatransfer = function(pasvconn) {
                    pasvconn.addListener("connect", function () {
                        socket.send("150 Connection Accepted\r\n");
                        var ls = sys.exec("ls -l " + fs.cwd());
                        ls.addCallback(function (stdout, stderr) {
                            pasvconn.send(stdout);
                            pasvconn.close();
                            socket.send("226 Transfer OK\r\n");
                        });
                        ls.addErrback(function () {
                            pasvconn.send("");
                            pasvconn.close();
                            socket.send("226 Transfer OK\r\n");
                        });
                    });
                };
                if(!socket.passive)
                    socket.datatransfer(
                        tcp.createConnection(socket.pasvport, socket.pasvhost)
                    );
            },
            "NLST": this.LIST,
            "PASS": () => {
                // Authentication password.
                socket.send("230 Logged on\r\n");
            },
            "PASV": () => {
                // Enter passive mode.
                socket.passive = true;
                socket.pasvhost = host;
                socket.pasvport = 0;
                var pasv = tcp.createServer((psocket) => {
                    psocket.addListener("connect", () => {
                        socket.datatransfer(psocket);
                    });
                    //DATA close
                    psocket.addListener("close", () => {});
                    //DATA eof
                    psocket.addListener("eof", () => {});
                    //DATA error: + had_error
                    psocket.addListener("error", (had_error) => {});
                });
                pasv.addListener("listening", (port: number) => {
                    socket.pasvport = port;
                    var i1 = port / 256;
                    var i2 = port % 256;
                    socket.send("227 Entering Passive Mode (" + host.split(".").join(",") + "," + i1 + "," + i2 + ")\r\n");
                });
                pasv.listen(0, host);
            },
            "PORT": (addr) => {
                // Specifies an address and port to which the server should connect.
                socket.passive = false;
                socket.pasvhost = addr[0]+"."+addr[1]+"."+addr[2]+"."+addr[3];
                socket.pasvport = (parseInt(addr[4]) * 256) + parseInt(addr[5]);
                socket.send("200 PORT command successful.\r\n");
            },
            "PWD": () => {
                // Print working directory. Returns the current directory of the host.
                socket.send("257 " + fs.cwd() + " is current directory\r\n");
            },
            "QUIT": () => {
                socket.send("221 Goodbye\r\n");
                socket.close();
            },
            "REST": (pos) => {
                // Restart transfer from the specified point.
                socket.totsize = parseInt(pos);
                socket.send("350 Rest supported. Restarting at " + socket.totsize + "\r\n");
            },        
            "RETR": (filename) => {
                // Retrieve (download) a remote file.
                socket.datatransfer = function(pasvconn) {
                    pasvconn.setEncoding(socket.mode);
                    pasvconn.addListener("connect", function () {
                        socket.send("150 Connection Accepted\r\n");
                        //DATA connect
                        if(fs.cwd() + filename != socket.filename) socket.totsize = 0;
                        socket.filename = fs.cwd() + filename;
                        fs.open(socket.filename,'r', (err, fd) => {
                            //"DATA file " + .fs.cwd() + command[1].trim() + " opened"
                            // posix.read(fd, 4096, socket.totsize, socket.mode).addCallback(function(chunk, bytes_read) {
                            //     var readChunk = (() => {
                            //         if(chunk) {
                            //             socket.totsize += bytes_read;
                            //             if(pasvconn.readyState == "open") pasvconn.send(chunk, socket.mode);
                            //             readChunk();
                            //         }
                            //         else {
                            //             //DATA file " + .fs.cwd() + filename.trim() + " closed"
                            //             pasvconn.close();
                            //             socket.send("226 Closing data connection, sent " + socket.totsize + " bytes\r\n");
                            //             posix.close(fd);
                            //             socket.totsize = 0;
                            //         }
                            //     })();
                            // });
                        });
                    });
                    pasvconn.addListener("close", () => {
                        // DATA close
                    });
                    pasvconn.addListener("eof", () => {
                        // DATA eof
                    });
                    pasvconn.addListener("error", (had_error) => {
                        // DATA error: " + had_error
                    });
                };
                if(!socket.passive)
                    socket.datatransfer(
                        tcp.createConnection(socket.pasvport, socket.pasvhost)
                    );
            },
            "RNFR": (filename) => {
                // Rename from.
                socket.filefrom = fs.cwd() + filename;
                socket.send("350 File exists, ready for destination name.\r\n");
            },
            "RNTO": (filename) => {
                // Rename to.
                var fileto = fs.cwd() + filename;
                var rn = sys.exec("mv " + socket.filefrom + " " + fileto);
                rn.addCallback((stdout, stderr) => {
                    socket.send("250 file renamed successfully\r\n");
                });
                rn.addErrback(() => {
                    socket.send("250 file renamed successfully\r\n");
                });
            },
            "SIZE": (filename) => {
                // Return the size of a file. (RFC 3659)
                var path = fs.cwd() + filename;
                // posix.stat(path).addCallback(function (s) {
                //     socket.send("213 " + s.size + "\r\n");
                // }).addErrback(() => {});
            },
            "STOR": (filename) => {
                // Store (upload) a file.
                socket.datatransfer = function(pasvconn) {
                    pasvconn.setEncoding(socket.mode);
                    var fd = new file.File(fs.cwd() + filename, 'w+', {encoding: socket.mode});
                    var size = 0;
                    var paused = false;
                    var npauses = 0;
                    pasvconn.addListener("receive", function(data) {
                        size += data.length;
                        fd.write(data);
                        if (!paused) {
                            pasvconn.readPause();
                            npauses += 1;
                            paused = true;
                            setTimeout(function () {
                                pasvconn.readResume();
                                paused = false;
                            }, 1);
                        }
                    });
                    pasvconn.addListener("connect", () => 
                        //DATA connect
                        socket.send("150 Connection Accepted\r\n")
                    );
                    //DATA close
                    pasvconn.addListener("close", () => {});
                    pasvconn.addListener("eof", () => {
                        fd.close();
                        //DATA eof
                        socket.send("226 Closing data connection, recv " + size + " bytes\r\n");
                    });
                    //DATA error: " + had_errorP
                    pasvconn.addListener("error", (had_error) => {});
                };
                if(!socket.passive)
                    socket.datatransfer(
                        tcp.createConnection(socket.pasvport, socket.pasvhost)
                    );
            },
            "SYST": () => // Return system type.
                socket.send("215 UNIX emulated by node/ftp\r\n"),
            "TYPE": (mode) => {
                // Sets the transfer mode (ASCII/Binary).
                var modes = {
                    'A': "ascii",
                    'I': "binary"
                };
                socket.mode = modes[mode];
                socket.send("200 Type set to " + mode + "\r\n");
            },
            "USER": (username) => // Authentication username.
                socket.send("331 password required for " + (socket.username = username) + "\r\n"),
            "XPWD": () => socket.send("257 " + fs.cwd() + " is the current directory\r\n")
        };
        router.Register(routes);

        socket.on("connect", () => {
            tracer.trace("FTP Client connected, sending 220", tracer.MessageType.Info);
            socket.send("220 gingervitis-ftp\r\n");
        });
        tracer.trace("FTP 'connect' listener added", tracer.MessageType.Info);
    	socket.on("data", (data) => {
            tracer.trace("FTP Command received: " + data, tracer.MessageType.Info);
    	    var words = data.split(" ");
    	    var command = f.head(words).trim().toUpperCase();
            router.Route(command, f.tail(words));
    	});
        tracer.trace("FTP 'receive' listener added", tracer.MessageType.Info);
    });
    
    tracer.trace("FTP Server created", tracer.MessageType.Info);
    return server;
};

tracer.trace("FTP Initialized", tracer.MessageType.Info);