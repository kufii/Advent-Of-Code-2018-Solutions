import input from './input.js';

var test = function*() {
	var output = '.';
	yield output;
	for (let i = 0; i < 100; i++) {
		output += '.';
		yield output;
	}
};

export default {
	part1() {
		return test();
	},
	part2() {
		return input;
	}
};
