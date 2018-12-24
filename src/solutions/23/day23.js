import input from './input.js';
import { maxBy, sortBy, desc } from '../../util.js';

const parseInput = () => input.split('\n').map(line => {
	const [x, y, z, range] = line.match(/pos=<([-\d]+),([-\d]+),([-\d]+)>, r=(\d+)/).slice(1).map(n => parseInt(n));
	return {
		pos: { x, y, z },
		range
	};
});

const distance = (pos1, pos2) => Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + Math.abs(pos1.z - pos2.z);

const iterate = function*(start, end, factor) {
	for (let x = start.x; x <= end.x; x += factor) {
		for (let y = start.y; y <= end.y; y += factor) {
			for (let z = start.z; z <= end.z; z += factor) {
				yield { x, y, z };
			}
		}
	}
};

export default {
	part1() {
		const bots = parseInput();
		const { range, pos } = bots.reduce(maxBy(a => a.range));
		return bots.filter(({ pos: pos2 }) => distance(pos, pos2) <= range).length;
	},
	part2() {
		const bots = parseInput();
		const min = {
			x: Math.min(...bots.map(({ pos }) => pos.x)),
			y: Math.min(...bots.map(({ pos }) => pos.y)),
			z: Math.min(...bots.map(({ pos }) => pos.z))
		};
		const max = {
			x: Math.max(...bots.map(({ pos }) => pos.x)),
			y: Math.max(...bots.map(({ pos }) => pos.y)),
			z: Math.max(...bots.map(({ pos }) => pos.z))
		};
		const origin = { x: 0, y: 0, z: 0 };
		console.log(min, max);
		return function*() {
			let best;
			let factor = 10000000;
			while (factor >= 1) {
				yield `Factor: ${factor}`;
				const start = best ? { x: best.x - (factor * 10), y: best.y - (factor * 10), z: best.z - (factor * 10) } : min;
				const end = best ? { x: best.x + (factor * 10), y: best.y + (factor * 10), z: best.z + (factor * 10) } : max;
				best = Array.from(iterate(start, end, factor)).sort(sortBy(
					desc(
						pos1 => bots.filter(({ pos, range }) => distance(pos1, pos) <= range).length
					),
					pos => distance(pos, origin)
				))[0];
				factor /= 10;
			}
			yield distance(best, origin);
		};
	},
	interval: 0
};
