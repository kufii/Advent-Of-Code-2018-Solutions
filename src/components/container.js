import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';
import SolutionLoader from './solution-loader.js';

export default () => ({
	view: () => m('div', [
		m('header.header', m('h1', 'Advent of Code 2018')),
		m('div.container', m(SolutionLoader))
	])
});
