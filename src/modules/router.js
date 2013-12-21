define(["require", "exports"], function(require, exports) {
    var store = require("store");
    var f = require("f");
    ;
    exports.Register = function (routes) {
        f.oMap(routes, function (path, cb) {
            return store.add(cb, path);
        });
    };
    exports.Route = function (route, data) {
        store.get(route)(data);
    };
})
