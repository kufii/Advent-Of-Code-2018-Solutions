import input from './input.js';
import { range } from '../../util.js';

const runRegex = input => {
	const pairs = [];
	range('A', 'Z').forEach(char => {
		pairs.push(char + char.toLowerCase());
		pairs.push(char.toLowerCase() + char);
	});
	const regex = new RegExp(pairs.join('|'));

	let lastLength;
	do {
		lastLength = input.length;
		input = input.replace(regex, '');
	} while (lastLength !== input.length);
	return input;
};

export default {
	part1() {
		return runRegex(input).length;
	},
	part2() {
		return function*() {
			const lengths = [];
			for (const char of range('A', 'Z')) {
				yield `${char}...`;
				lengths.push(runRegex(input.replace(new RegExp(char, 'ig'), '')).length);
			}
			yield Math.min(...lengths);
		};
	},
	interval: 0
};
