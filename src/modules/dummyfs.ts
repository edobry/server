// adapted from billywhizz/nodeftpd/dummyfs
// https://github.com/billywhizz/nodeftpd/blob/master/dummyfs.js

var sys = require("sys");
var tracer = require("./console-tracer");

var _dir = "/";

export var chdir = (dir: string): string => {
	if(dir.charAt(dir.length-1) != "/") dir += "/";
	if(dir.charAt(0) != "/"){
		if(dir.substr(0,2) == ".."){
			var x = dir.split("/");
			for(var i=0; i<x.length; i++){
				if(x[i] == ".."){
					var part = _dir.split("/");
					part.splice(part.length -2, 1);
					var ret = part.join("/");
					if(ret.charAt(ret.length-1) != "/") ret += "/";
					_dir = ret;
				}
				else{
					_dir += x[i];
				}
			}
		}
		else{
			if(dir.substr(0,2) == "./"){
				_dir += dir.substr(2,dir.length);
			}
			else{
				_dir += dir;
			}
		}
	}
	else{
		_dir = dir;
	}
	if(_dir.charAt(_dir.length-1) != "/") _dir += "/";
	return(_dir);
};

export var cwd = ():string => _dir;

tracer.trace("DUMMYFS Initialized", tracer.MessageType.Info);