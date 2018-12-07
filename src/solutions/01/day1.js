import input from './input.js';
import { toIterator } from '../../util.js';

const parseInput = () => input.split('\n').map(num => parseInt(num));

export default {
	part1() {
		return parseInput().reduce((a, b) => a + b, 0);
	},
	part2() {
		const input = parseInput();

		let value = 0;
		const history = [value];

		for (const num of toIterator(input, true)) {
			value += num;
			if (history.includes(value)) return value;
			history.push(value);
		}
	}
};
