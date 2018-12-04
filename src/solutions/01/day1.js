import { loadInput, toIterator } from '../../util.js';

const FILE = 'day1';

const parseInput = () => loadInput(FILE).then(data => data.split('\n').map(num => parseInt(num)));

export default {
	async part1() {
		return (await parseInput()).reduce((a, b) => a + b, 0);
	},
	async part2() {
		const input = await parseInput();

		let value = 0;
		const history = [value];

		for (const num of toIterator(input, true)) {
			value += num;
			if (history.includes(value)) return value;
			history.push(value);
		}
	}
};
