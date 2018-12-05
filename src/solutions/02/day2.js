import { loadInput, distinct, countOccurances } from '../../util.js';

const FILE = 'day2';

const parseInput = () => loadInput(FILE).then(data => data.split('\n'));

const differences = (str1, str2) => {
	if (str1.length !== str2.length) return -1;
	let count = 0;
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) count++;
	}
	return count;
};

export default {
	async part1() {
		let count2 = 0;
		let count3 = 0;
		(await parseInput()).forEach(str => {
			const chars = str.split('').filter(distinct);
			if (chars.some(char => countOccurances(str, char) === 2)) count2++;
			if (chars.some(char => countOccurances(str, char) === 3)) count3++;
		});
		return count2 * count3;
	},
	async part2() {
		const input = await parseInput();
		let output = '';
		input.some(str => {
			const pairs = input.filter(str2 => differences(str, str2) === 1);
			pairs.forEach(str2 => {
				for (let i = 0; i < str.length; i++) {
					if (str[i] === str2[i]) output += str[i];
				}
			});
			return pairs.length > 0;
		});
		return output;
	}
};
