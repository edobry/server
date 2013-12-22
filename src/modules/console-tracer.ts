/// <reference path="../../typings/tracer.d.ts" />

require('colors');

export enum MessageType {
	Info,
	Error
}

var typeColors = {
	"Info": "magenta",
	"Error": "red"
};

export var trace = (message: string, type: MessageType) => {
	console.log(message[typeColors[MessageType[type].toString()]]);
}