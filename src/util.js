import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';

const loadInput = file => {
	return m.request({
		url: `../../inputs/${file}.txt`,
		deserialize: data => data.trim(),
		background: true
	});
};

const toIterator = (arr, loop=false) => {
	return {
		*[Symbol.iterator]() {
			for (let i = 0; i < loop ? Infinity : arr.length; i++) {
				yield arr[i % arr.length];
			}
		}
	};
};

export { loadInput, toIterator };
