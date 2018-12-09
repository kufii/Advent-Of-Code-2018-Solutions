import m from 'https://unpkg.com/mithril@next?module';
import Select from './select.js';
import solutions from '../solutions/all-solutions.js';

export default () => {
	let isLoading = false;
	let output = '';
	let solution = 0;

	const load = fn => {
		isLoading = true;
		m.redraw();
		setTimeout(() => {
			const logErr = err => {
				output = 'Error';
				isLoading = false;
				m.redraw();
				console.error(err);
			};
			try {
				Promise.resolve(fn())
					.then(data => {
						output = data;
						isLoading = false;
					})
					.then(m.redraw)
					.catch(logErr);
			} catch (err) {
				logErr(err);
			}
		}, 0);
	};

	const loadButton = (text, onclick) => m('button.pure-button.pure-button-primary', {
		disabled: isLoading,
		onclick
	}, text);

	return {
		view: () =>
			m('div.pure-form', [
				m('label', 'Day: '),
				m(Select, {
					options: solutions.map(
						(s, index) => ({ value: index, text: `Day ${index + 1}` })
					),
					selected: solution,
					onselect: value => solution = value
				}),
				m('div', [
					loadButton('Part 1', () => load(solutions[solution].part1)),
					loadButton('Part 2', () => load(solutions[solution].part2))
				]),
				m('pre', isLoading ? 'Loading...' : output)
			])
	};
};
