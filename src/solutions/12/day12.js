import input from './input.js';
import { nTimes, toDict } from '../../util.js';

const parseInput = () => {
	const [_, initialState] = input.match(/^initial state: ([#.]+)/);

	const pots = initialState.split('')
		.map((pot, key) => ({ key, value: pot === '#' }))
		.reduce(toDict(a => a.key, a => a.value), {});

	const rules = input.split('\n').slice(1).filter(line => line).map(line => {
		const [rule, result] = line.split(' => ');
		return { rule, result: result === '#' };
	}).reduce(toDict(a => a.rule, a => a.result), {});

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

	yield getScore();
	for (let i = 0; i < n; i++) {
		expandBounds();
		const newPots = {};
		Object.entries(pots).forEach(([index]) => {
			const key = toRule(parseInt(index));
			const rule = rules[key];
			newPots[index] = rule || false;
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
		const TIMES = 50000000000;

		let i = -1;
		const nums = [];
		let diffs = [];
		let previousDiff = 0;
		let patternMatches = 0;
		for (const sum of run(TIMES)) {
			if (nums.length > 0) diffs.push(sum - nums[nums.length - 1]);
			nums.push(sum);
			i++;
			if (i > 0 && i % 10 === 0) {
				const diff = diffs.reduce((a, b) => a + b, 0);
				diffs = [];
				patternMatches = diff === previousDiff ? patternMatches + 1 : 0;
				if (patternMatches === 5) break;
				previousDiff = diff;
			}
		}

		return nums[nums.length - 1] + (previousDiff * ((TIMES - i) / 10));
	}
};
