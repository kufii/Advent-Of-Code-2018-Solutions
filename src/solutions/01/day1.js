import input from './input.js';
import { toIterator } from '../../util.js';

const parseInput = () => input.split('\n').map(num => parseInt(num));

export default {
	part1() {
		return parseInput().reduce((a, b) => a + b, 0);
	},
	part2() {
		return function*() {
			const input = parseInput();

			let value = 0;
			const history = [value];

			let i = 0;
			for (const num of toIterator(input, true)) {
				value += num;
				if (history.includes(value)) return yield value;
				history.push(value);
				i++;
				if (i % 1000 === 0) yield 'Running...';
			}
		};
	},
	interval: 0
};
