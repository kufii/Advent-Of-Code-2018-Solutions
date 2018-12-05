import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';

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

const distinct = arr => arr.filter((value, index, self) => self.indexOf(value) === index);

const countOccurances = (str, toCount) => (str.length - str.replace(new RegExp(toCount, 'g'), '').length) / toCount.length;

const charRange = (start, stop) => {
	const result = [];
	for (let i = start.charCodeAt(0); i <= stop.charCodeAt(0); i++) {
		result.push(String.fromCharCode(i));
	}
	return result;
};

const maxBy = cb => (a, b) => cb(b) > cb(a) ? b : a;

const minBy = cb => (a, b) => cb(b) < cb(a) ? b : a;

const sortBy = cb => (a, b) => cb(a) - cb(b);

const sortByDesc = cb => (a, b) => cb(b) - cb(a);

export { loadInput, toIterator, distinct, countOccurances, charRange, sortBy, sortByDesc, maxBy, minBy };
