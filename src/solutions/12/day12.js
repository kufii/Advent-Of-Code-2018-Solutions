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

const run = function*(n) {
	let { pots, rules } = parseInput();

	const potIndexes = () => Object.entries(pots).filter(([_, pot]) => pot).map(([i]) => parseInt(i));
	const getScore = () => potIndexes().reduce((count, i) => count + i, 0);
	const toChar = bool => bool ? '#' : '.';
	const toRule = i => toChar(pots[i - 2]) + toChar(pots[i - 1]) + toChar(pots[i]) + toChar(pots[i + 1]) + toChar(pots[i + 2]);
	const expandBounds = () => {
		const indexes = potIndexes();
		const min = Math.min(...indexes);
		const max = Math.max(...indexes);
		nTimes(i => {
			pots[min - (i + 1)] = false;
			pots[max + (i + 1)] = false;
		}, 3);
	};

	for (let i = 0; i < n; i++) {
		expandBounds();
		const newPots = {};
		Object.entries(pots).forEach(([index]) => {
			const key = toRule(parseInt(index));
			const rule = rules.find(r => r.rule === key);
			newPots[index] = rule ? rule.result : false;
		});
		pots = newPots;
		yield getScore();
	}
};

export default {
	part1() {
		return Array.from(run(20)).pop();
	},
	part2() {
		const firstScores = Array.from(run(200));
		const differences = firstScores.map((value, index) => value - firstScores[index - 1] || 0);
		const every100 = differences.slice(100, 200).reduce((a, b) => a + b, 0);
		return firstScores[firstScores.length - 1] + (every100 * ((50000000000 - 200) / 100));
	}
};
