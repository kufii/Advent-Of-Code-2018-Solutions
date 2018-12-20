import { m } from '../ext-deps.js';
import Select from './select.js';
import solutions from '../solutions/all-solutions.js';
import { isGenerator } from '../types.js';

const getStorage = (key, def) => localStorage.getItem(key) == null ? def : localStorage.getItem(key);

export default () => {
	let isLoading = false;
	let output = '';
	let solution = getStorage('day', 0);
	let showVisualization = getStorage('showVisualization', 'true') === 'true';

	let interval;
	let intervalRunning = false;

	const stopInterval = () => {
		clearInterval(interval);
		intervalRunning = false;
	};

	const changeDay = day => {
		stopInterval();
		solution = day;
		localStorage.setItem('day', day);
		output = '';
	};

	const changeShowVisualization = bool => {
		showVisualization = bool;
		localStorage.setItem('showVisualization', bool);
	};

	const load = fn => {
		const day = solution;
		stopInterval();
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
				Promise.resolve(fn(showVisualization))
					.then(data => {
						isLoading = false;
						if (isGenerator(data)) {
							data = data();
							output = '';
							interval = setInterval(() => {
								const { value, done } = data.next();
								if (done) {
									stopInterval();
								} else {
									output = value;
								}
								m.redraw();
							}, solutions[day].interval);
							intervalRunning = true;
						} else {
							output = data;
						}
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
			m('div', [
				m('div.pure-form.controls', [
					m('label', 'Day: '),
					m(Select, {
						options: solutions.map(
							(s, index) => ({ value: index, text: `Day ${index + 1}` })
						),
						selected: solution,
						onselect: changeDay
					}),
					m('div', { hidden: !solutions[solution].optionalVisualization }, [
						m('label', ['Visualize ', m('input[type=checkbox]', {
							oninput: ({ target: t }) => changeShowVisualization(t.checked),
							checked: showVisualization
						})])
					]),
					m('div', [
						loadButton('Part 1', () => load(solutions[solution].part1)),
						loadButton('Part 2', () => load(solutions[solution].part2))
					]),
					m('div', { hidden: !intervalRunning }, m('button.pure-button', { onclick: stopInterval }, 'Stop!'))
				]),
				m('pre', isLoading ? 'Loading...' : solutions[solution].html ? m.trust(output) : output)
			])
	};
};
