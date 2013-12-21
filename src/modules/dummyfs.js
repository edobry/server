define(["require", "exports"], function(require, exports) {
    var sys = require("sys");
    var _dir = "/";
    exports.chdir = function (dir) {
        if(dir.charAt(dir.length - 1) != "/") {
            dir += "/";
        }
        if(dir.charAt(0) != "/") {
            if(dir.substr(0, 2) == "..") {
                x = dir.split("/");
                for(i = 0; i < x.length; i++) {
                    if(x[i] == "..") {
                        part = _dir.split("/");
                        part.splice(part.length - 2, 1);
                        ret = part.join("/");
                        if(ret.charAt(ret.length - 1) != "/") {
                            ret += "/";
                        }
                        _dir = ret;
                    } else {
                        _dir += x[i];
                    }
                }
            } else {
                if(dir.substr(0, 2) == "./") {
                    _dir += dir.substr(2, dir.length);
                } else {
                    _dir += dir;
                }
            }
        } else {
            _dir = dir;
        }
        if(_dir.charAt(_dir.length - 1) != "/") {
            _dir += "/";
        }
        return (_dir);
    };
    exports.cwd = function () {
        return dir;
    };
})
