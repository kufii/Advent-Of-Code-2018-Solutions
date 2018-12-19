import input from './input.js';

const ops = {
	addr: (reg, a, b) => reg[a] + reg[b],
	addi: (reg, a, b) => reg[a] + b,
	mulr: (reg, a, b) => reg[a] * reg[b],
	muli: (reg, a, b) => reg[a] * b,
	banr: (reg, a, b) => reg[a] & reg[b],
	bani: (reg, a, b) => reg[a] & b,
	borr: (reg, a, b) => reg[a] | reg[b],
	bori: (reg, a, b) => reg[a] | b,
	setr: (reg, a, _) => reg[a],
	seti: (reg, a, _) => a,
	gtir: (reg, a, b) => a > reg[b] ? 1 : 0,
	gtri: (reg, a, b) => reg[a] > b ? 1 : 0,
	gtrr: (reg, a, b) => reg[a] > reg[b] ? 1 : 0,
	eqir: (reg, a, b) => a === reg[b] ? 1 : 0,
	eqri: (reg, a, b) => reg[a] === b ? 1 : 0,
	eqrr: (reg, a, b) => reg[a] === reg[b] ? 1 : 0
};

const parseInput = () => {
	let [samples, program] = input.split('\n\n\n');
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
	program = program.trim().split('\n').map(op => {
		const [code, a, b, c] = op.split(' ');
		return {
			code: parseInt(code),
			a: parseInt(a),
			b: parseInt(b),
			c: parseInt(c)
		};
	});
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
			const otherCodes = Object.entries(codes).filter(([c]) => c !== code);
			if (list.length === 1) {
				otherCodes.forEach(([key, value]) => {
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
