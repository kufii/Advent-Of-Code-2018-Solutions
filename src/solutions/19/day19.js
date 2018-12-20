import input from './input.js';

const ops = {
	addr: (r, a, b) => r[a] + r[b],
	addi: (r, a, b) => r[a] + b,
	mulr: (r, a, b) => r[a] * r[b],
	muli: (r, a, b) => r[a] * b,
	banr: (r, a, b) => r[a] & r[b],
	bani: (r, a, b) => r[a] & b,
	borr: (r, a, b) => r[a] | r[b],
	bori: (r, a, b) => r[a] | b,
	setr: (r, a) => r[a],
	seti: (r, a) => a,
	gtir: (r, a, b) => a > r[b] ? 1 : 0,
	gtri: (r, a, b) => r[a] > b ? 1 : 0,
	gtrr: (r, a, b) => r[a] > r[b] ? 1 : 0,
	eqir: (r, a, b) => a === r[b] ? 1 : 0,
	eqri: (r, a, b) => r[a] === b ? 1 : 0,
	eqrr: (r, a, b) => r[a] === r[b] ? 1 : 0
};

const parseInput = () => {
	const lines = input.split('\n');
	const bound = parseInt(lines[0].split(' ')[1]);
	const program = lines.slice(1).map(line => {
		const [op, a, b, c] = line.split(' ');
		return {
			op,
			a: parseInt(a),
			b: parseInt(b),
			c: parseInt(c)
		};
	});
	return { bound, program };
};

export default {
	part1() {
		const { bound, program } = parseInput();
		const register = [0, 0, 0, 0, 0, 0];

		while (register[bound] >= 0 && register[bound] < program.length) {
			const { op, a, b, c } = program[register[bound]];
			register[c] = ops[op](register, a, b);
			register[bound]++;
		}
		return JSON.stringify(register);
	},
	part2() {
		const solution = () => {
			let r0 = 0;
			let r2 = 1;
			const r4 = 10551326;

			do {
				if (r4 % r2 === 0) r0 += r2;
				r2++;
			} while (r2 <= r4);

			return r0;
		};
		const getText = () => solution.toString().split('\n').slice(1, -1).map(line => line.replace('\t\t\t', '')).join('\n');
		return `${solution()}\nManually Solved Code:\n<pre style='display:inline-block;text-align:left'>${getText()}</span>`;
	},
	html: true
};
