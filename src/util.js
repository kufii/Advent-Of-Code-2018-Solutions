import m from 'https://unpkg.com/mithril@next?module';

const loadInput = file => m.request({
	url: `../../inputs/${file}.txt`,
	deserialize: data => data.trim(),
	background: true
});

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

const makeArray = (ySize, xSize, fill=null) => {
	const arr = [];
	for (let y = 0; y < ySize; y++) {
		arr.push([]);
		for (let x = 0; x < xSize; x++) {
			arr[y].push(fill);
		}
	}
	return arr;
};

const distinct = (value, index, self) => self.indexOf(value) === index;

const maxBy = cb => (a, b) => cb(b) > cb(a) ? b : a;

const minBy = cb => (a, b) => cb(b) < cb(a) ? b : a;

const sortBy = cb => (a, b) => cb(a) - cb(b);

const sortByDesc = cb => (a, b) => cb(b) - cb(a);

const groupBy = (cbKey, cbValue) => (a, b) => {
	const key = cbKey(b);
	const value = cbValue ? cbValue(b) : b;
	if (!a[key]) a[key] = [];
	a[key].push(value);
	return a;
};

export { loadInput, toIterator, countOccurances, charRange, makeArray, distinct, maxBy, minBy, sortBy, sortByDesc, groupBy };
