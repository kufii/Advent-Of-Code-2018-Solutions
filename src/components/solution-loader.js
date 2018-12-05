import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';
import Select from './select.js';
import solutions from '../solutions/all-solutions.js';

export default () => {
	let isLoading = false;
	let output = '';
	let solution = 0;

	const load = promise => {
		isLoading = true;
		promise
			.then(data => {
				output = data;
				isLoading = false;
			})
			.then(m.redraw)
			.catch(err => {
				output = 'Error';
				isLoading = false;
				m.redraw();
				console.error(err);
			});
	};

	return {
		view: () =>
			m('div', [
				m('div', [
					m('label', 'Day: '),
					m(Select, {
						options: solutions.map((s, index) => {
							return { value: index, text: `Day ${index + 1}` };
						}),
						selected: solution,
						onselect: value => solution = value
					})
				]),
				m('div', [
					m('button', {
						disabled: isLoading,
						onclick: () => load(solutions[solution].part1())
					}, 'Part 1'),
					m('button', {
						disabled: isLoading,
						onclick: () => load(solutions[solution].part2())
					}, 'Part 2')
				]),
				m('pre', isLoading ? 'Loading...' : output)
			])
	};
};
