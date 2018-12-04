import { loadInput } from '../../util/aoc.js';

const FILE = 'day1';

export default {
	async part1() {
		const input = await loadInput(FILE);
		return input.split('\n').map(num => parseInt(num)).reduce((a, b) => a + b, 0);
	},
	part2() {
		return new Promise(resolve => {
			setTimeout(() => resolve('Day 1 Part 2'), 1000);
		});
	}
};
