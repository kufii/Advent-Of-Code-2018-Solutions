import input from './input.js';
import { ops, build } from '../common/elfcode.js';

const parseInput = () => {
	let [samples, programtext] = input.split('\n\n\n');
	samples = samples.trim().split('\n\n').map(s => {
		const [before, op, after] = s.split('\n');
		const regex = /(\[.+\])/;
		const [_, input] = before.match(regex);
		const [__, out] = after.match(regex);
		const [code, a, b, c] = op.split(' ');
		return {
			code: parseInt(code),
			a: parseInt(a),
			b: parseInt(b),
			c: parseInt(c),
			input: JSON.parse(input),
			out: JSON.parse(out)
		};
	});
	const { program } = build(programtext);
	return { samples, program };
};

const getMatches = s => Object.entries(ops).filter(([_, fn]) => {
	const input = s.input.slice();
	input[s.c] = fn(input, s.a, s.b);
	return JSON.stringify(input) === JSON.stringify(s.out);
}).map(([key]) => key);

const computeSamples = samples => {
	const codes = {};
	samples.forEach(s => {
		const matches = getMatches(s);
		codes[s.code] = codes[s.code] ? codes[s.code].filter(code => matches.includes(code)) : matches;
	});
	while (Object.entries(codes).some(([_, list]) => list.length > 1)) {
		Object.entries(codes).forEach(([code, list]) => {
			if (list.length === 1) {
				Object.entries(codes).filter(([c]) => c !== code).forEach(([key, value]) => {
					codes[key] = value.filter(c => c !== list[0]);
				});
			}
		});
	}
	return codes;
};

export default {
	part1() {
		const { samples } = parseInput();
		const matches = samples.map(getMatches);
		return matches.filter(m => m.length >= 3).length;
	},
	part2() {
		const { samples, program } = parseInput();
		const codes = computeSamples(samples);
		const register = [0, 0, 0, 0];
		program.forEach(({ code, a, b, c }) => register[c] = ops[codes[code]](register, a, b));
		return JSON.stringify(register);
	}
};
