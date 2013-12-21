define(["require", "exports"], function(require, exports) {
    exports.clone = function (l) {
        return l.slice(0);
    };
    exports.head = function (l) {
        return l[0];
    };
    exports.tail = function (l) {
        return l.slice(1);
    };
    exports.prepend = function (e, l) {
        var newL = exports.clone(l);
        newL.unshift(e);
        return newL;
    };
    exports.zip = function () {
        var arrs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            arrs[_i] = arguments[_i + 0];
        }
        var tailArrs = exports.tail(arrs);
        return exports.head(arrs).map(function (el, i) {
            return exports.prepend(el, tailArrs.map(function (arr) {
                return arr[i];
            }));
        });
    };
    exports.oMap = function (o, f) {
        var keys = Object.keys(o);
        var values = keys.map(function (key) {
            return o[key];
        });
        return exports.zip(keys, values).map(function (args) {
            return f.apply(null, args);
        });
    };
})
