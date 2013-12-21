interface Event {
	name: string;
	subscribers: { (event: any): any; }[];
};

var _events = (() => {
	var events = {};

	return {
		getOrCreate: (event) => {
			return events.hasOwnProperty(event)
				? events[event]
				: (events[event] = []);
		}
	}
})();

export var Subscribe = (event, cb) => {
	_events.getOrCreate(event).push(cb);
};