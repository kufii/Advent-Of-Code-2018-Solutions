import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';

const loadInput = file => {
	return m.request({
		url: `../../inputs/${file}.txt`,
		deserialize: data => data.trim()
	});
};

export { loadInput };
