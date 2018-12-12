import input from './input.js';
import { nTimes, sortBy } from '../../util.js';

const parseInput = () => {
	const pots = {};

	const [_, initialState] = input.match(/^initial state: ([#.]+)/);
	initialState.split('').forEach((pot, i) => pots[i] = pot === '#');

	const rules = input.split('\n').filter(line => line).map(line => {
		const [rule, result] = line.split(' => ');
		return { rule, result: result === '#' };
	});

	return { pots, rules };
};

export default {
	part1() {
		let { pots, rules } = parseInput();
		nTimes(() => {
			const toChar = bool => bool ? '#' : '.';
			const toRule = i => toChar(pots[i - 2]) + toChar(pots[i - 1]) + toChar(pots[i]) + toChar(pots[i + 1]) + toChar(pots[i + 2]);
			const expandBounds = () => {
				const indexes = Object.entries(pots).filter(([_, pot]) => pot).map(([i]) => parseInt(i));
				const min = Math.min(...indexes);
				const max = Math.max(...indexes);
				nTimes(i => {
					pots[min - (i + 1)] = false;
					pots[max + (i + 1)] = false;
				}, 3);
			};
			expandBounds();
			const newPots = {};
			Object.entries(pots).forEach(([index]) => {
				const key = toRule(parseInt(index));
				const rule = rules.find(r => r.rule === key);
				newPots[index] = rule ? rule.result : false;
			});
			pots = newPots;
		}, 20);
		return Object.entries(pots).filter(([_, pot]) => pot).reduce((count, [index]) => count + parseInt(index), 0);
	},
	part2() {
		return input;
	}
};
