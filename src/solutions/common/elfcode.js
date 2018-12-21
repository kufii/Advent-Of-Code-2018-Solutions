const build = input => {
	const lines = input.trim().split('\n');
	const bound = lines[0].startsWith('#') ? parseInt(lines[0].split(' ')[1]) : null;
	const program = (bound == null ? lines : lines.slice(1)).map(line => {
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

const run = function*(program, bound, register) {
	while (register[bound] >= 0 && register[bound] < program.length) {
		const cmd = program[register[bound]];
		const { op, a, b, c } = cmd;
		register[c] = ops[op](register, a, b);
		register[bound]++;
		yield { cmd, register };
	}
};

export { build, ops, run };
