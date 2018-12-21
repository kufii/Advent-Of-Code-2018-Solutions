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
			if (op === 'eqrr' && b === 0) {
				return register[a];
			}
			register[c] = ops[op](register, a, b);
			register[bound]++;
		}
	},
	part2() {
		/* eslint-disable no-constant-condition */
		const solution = () => {
			let r4 = 11840402;
			const history = [];
			do {
				if (history.includes(r4)) {
					return history[history.length - 1];
				}
				history.push(r4);
				let r2 = r4 | 65536;
				r4 = 6152285;
				do {
					r4 += r2 & 255;
					r4 &= 16777215;
					r4 *= 65899;
					r4 &= 16777215;
					if (r2 < 256) break;
					r2 = Math.floor(r2 / 256);
				} while (true);
			} while (true);
		};
		/* eslint-enable no-constant-condition */
		const getText = () => solution.toString().split('\n').slice(1, -1).map(line => line.replace('\t\t\t', '')).join('\n');
		return `${solution()}\nManually Solved Code:\n<pre style='display:inline-block;text-align:left'>${getText()}</span>`;
	},
	interval: 0,
	html: true
};
