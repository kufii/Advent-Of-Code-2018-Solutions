import input from './input.js';
import { build, run } from '../common/elfcode.js';

export default {
	part1() {
		const { program, bound } = build(input);
		for (const { cmd, register } of run(program, bound, [0, 0, 0, 0, 0, 0])) {
			const { op, a, b } = cmd;
			if (op === 'eqrr' && b === 0) {
				return register[a];
			}
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
		return `${solution()}\nReverse Engineered Code:\n<pre style='display:inline-block;text-align:left'>${getText()}</span>`;
	},
	html: true
};
