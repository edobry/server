/// <reference path="../../typings/reference.ts"/>

var f = require("./f");
var store = require("./store");
var tracer = require("./console-tracer");

export interface Route {
	path: string;
	handler: { (any: any):any; };
};

export var Register = (routes: Object): void => {
	var count = 0;
	f.oMap(routes, (path, cb) => { count++; store.Add(cb, path); });		
    tracer.trace("ROUTER " + count + " routes registered", tracer.MessageType.Info);
};

export var Route = (route, data) => {
	tracer.trace("ROUTER route:" + route + ", data:" + data, tracer.MessageType.Info);
	store.get(route)(data);
};