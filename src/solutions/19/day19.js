import input from './input.js';
import { build, run } from '../common/elfcode.js';

export default {
	part1() {
		const { program, bound } = build(input);
		let register = [0, 0, 0, 0, 0, 0];
		for (const step of run(program, bound, register)) {
			register = step.register;
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
		return `${solution()}\nReverse Engineered Code:\n<pre style='display:inline-block;text-align:left'>${getText()}</span>`;
	},
	html: true
};
