define(["require", "exports"], function(require, exports) {
    var test = {
        ditto: 1
    };
    var _data = (function () {
        var values = {
        };
        var nextGUID = 0;
        var GUIDgen = function () {
            return nextGUID++;
        };
        return {
            add: function (item) {
                var guid = GUIDgen();
                values[guid] = item;
                return guid;
            },
            get: function (guid) {
                return values[guid];
            },
            getData: function () {
                return values;
            }
        };
    })();
    var _labels = (function () {
        var labels = {
        };
        var Label = function (name) {
            return {
                name: name,
                type: [],
                members: []
            };
        };
        return {
            GetOrCreate: function (name) {
                return (labels.hasOwnProperty(name) ? labels[name] : (labels[name] = Label(name)));
            },
            getData: function () {
                return labels;
            }
        };
    })();
    var _types = {
    };
    _types["file"] = [
        "name", 
        "data"
    ];
    exports.Add = function (data, path) {
        var names = path.split('/');
        var guid = _data.add(data);
        names.map(function (name) {
            return _labels.GetOrCreate(name).members.push(guid);
        });
    };
    exports.Get = function (label) {
        return _labels.GetOrCreate(label).members.map(_data.get);
    };
})
