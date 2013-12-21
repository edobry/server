/// <reference path="../../typings/reference.ts"/>

var store = require("store");
var f = require("f");

export interface Route {
	path: string;
	handler: { (any: any):any; };
};

export var Register = (routes: Object): void => {
	f.oMap(routes, (path, cb) => store.add(cb, path));
};

export var Route = (route, data) => {
	store.get(route)(data);
};