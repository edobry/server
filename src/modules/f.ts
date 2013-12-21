//Array function
export var clone = (l) => l.slice(0);
export var head = (l) => l[0];
export var tail = (l) => l.slice(1);
export var prepend = (e, l) => { var newL =clone(l); newL.unshift(e); return newL; };

// f.zip(arr1, arr2, arr3... arrN)
export var zip = (...arrs: any[]) => {
	var tailArrs = tail(arrs);
	return head(arrs).map((el, i) => 
		prepend(el, 
			tailArrs.map((arr) => 
				arr[i]
			)
		)
	);
};

//Object functions
// f.oMap(l, (k, v) => {})
export var oMap = (o: Object, f: {(k: string, v: any):any;}) => {
	var keys = Object.keys(o);
	var values = keys.map((key) => o[key]);
	return zip(keys, values).map((args) => f.apply(null, args));
};