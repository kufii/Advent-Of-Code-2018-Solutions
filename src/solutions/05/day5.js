import input from './input.js';
import { charRange } from '../../util.js';

const runRegex = input => {
	const pairs = [];
	charRange('A', 'Z').forEach(char => {
		pairs.push(char + char.toLowerCase());
		pairs.push(char.toLowerCase() + char);
	});
	const regex = new RegExp(pairs.join('|'));

	let lastInput;
	do {
		lastInput = input;
		input = input.replace(regex, '');
	} while (lastInput !== input);
	return input;
};

export default {
	part1() {
		return runRegex(input).length;
	},
	part2() {
		const lengths = charRange('A', 'Z')
			.map(
				char => runRegex(input.replace(new RegExp(char, 'ig'), '')).length
			);
		return Math.min(...lengths);
	}
};
