import { loadInput, charRange } from '../../util.js';

const FILE = 'day5';

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
	async part1() {
		let input = await loadInput(FILE);

		input = runRegex(input);

		return input.length;
	},
	async part2() {
		const input = await loadInput(FILE);

		const lengths = charRange('A', 'Z')
			.map(
				char => runRegex(input.replace(new RegExp(char, 'ig'), '')).length
			);
		return Math.min(...lengths);
	}
};
