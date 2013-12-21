/// <reference path="../../typings/reference.ts"/>

var test = {ditto:1};
var _data = (() => {
	var values = {};

	var nextGUID = 0;
	var GUIDgen = () => nextGUID++;

	return {
		add: (item) => {
      		var guid = GUIDgen();
			values[guid] = item;
			return guid;
		},
		get: (guid) => values[guid],
	    getData: () => values
	}
})();

var _labels = (() => {
	var labels = {};
	var Label = (name) => {
		return { name: name, type: [], members: [] };
	};

	return {
		GetOrCreate: (name) => {
			return (labels.hasOwnProperty(name) ? labels[name] : (labels[name] = Label(name)));
		},
    	getData: () => labels
	};
})();

var _types = {};
_types["file"] = ["name", "data"];

export var Add = (data: any, path: string) => {
	var names = path.split('/');
	var guid = _data.add(data);

	names.map((name) => _labels.GetOrCreate(name).members.push(guid));
};

export var Get = (label: string/*...labels: string[]*/) => {
	return _labels.GetOrCreate(label).members.map(_data.get);
};