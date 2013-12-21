define(["require", "exports"], function(require, exports) {
    ;
    var _events = (function () {
        var events = {
        };
        return {
            getOrCreate: function (event) {
                return events.hasOwnProperty(event) ? events[event] : (events[event] = []);
            }
        };
    })();
    exports.Subscribe = function (event, cb) {
        _events.getOrCreate(event).push(cb);
    };
})
