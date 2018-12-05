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

const differences = (str1, str2) => {
	if (str1.length !== str2.length) return -1;
	let count = 0;
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) count++;
	}
	return count;
};

export { loadInput, toIterator, distinct, countOccurances, differences };
