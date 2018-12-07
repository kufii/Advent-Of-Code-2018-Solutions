const toIterator = (arr, loop=false) => ({
	*[Symbol.iterator]() {
		for (let i = 0; i < loop ? Infinity : arr.length; i++) {
			yield arr[i % arr.length];
		}
	}
});

const countOccurances = (str, toCount) => (str.length - str.replace(new RegExp(toCount, 'g'), '').length) / toCount.length;

const charRange = (start, stop) => {
	const result = [];
	for (let i = start.charCodeAt(0); i <= stop.charCodeAt(0); i++) {
		result.push(String.fromCharCode(i));
	}
	return result;
};

const makeArray = (ySize, xSize=null, fill=null) => {
	const arr = [];
	for (let y = 0; y < ySize; y++) {
		if (xSize) {
			arr.push([]);
			for (let x = 0; x < xSize; x++) {
				arr[y].push(fill);
			}
		} else {
			arr.push(fill);
		}
	}
	return arr;
};

const isString = a => typeof a === 'string' || a instanceof String;

const distinct = (value, index, self) => self.indexOf(value) === index;

const maxBy = cb => (a, b) => cb(b) > cb(a) ? b : a;

const minBy = cb => (a, b) => cb(b) < cb(a) ? b : a;

const sortBy = cb => (a, b) => isString(cb(a)) ? cb(a).localeCompare(cb(b)) : cb(a) - cb(b);

const sortByDesc = cb => (a, b) => isString(cb(a)) ? cb(b).localeCompare(cb(a)) : cb(b) - cb(a);

const groupBy = (cbKey, cbValue) => (a, b) => {
	const key = cbKey(b);
	const value = cbValue ? cbValue(b) : b;
	if (!a[key]) a[key] = [];
	a[key].push(value);
	return a;
};

export { toIterator, countOccurances, charRange, makeArray, isString, distinct, maxBy, minBy, sortBy, sortByDesc, groupBy };
