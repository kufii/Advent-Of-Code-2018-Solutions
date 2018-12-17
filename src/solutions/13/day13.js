import input from './input.js';
import { makeArray, sortBy } from '../../util.js';

const DIRS = {
	'^': { dx: 0, dy: -1, left: '<', right: '>', straight: '^', corners: { '\\': '<', '/': '>' } },
	'<': { dx: -1, dy: 0, left: 'v', right: '^', straight: '<', corners: { '\\': '^', '/': 'v' } },
	'>': { dx: 1, dy: 0, left: '^', right: 'v', straight: '>', corners: { '\\': 'v', '/': '^' } },
	'v': { dx: 0, dy: 1, left: '>', right: '<', straight: 'v', corners: { '\\': '>', '/': '<' } }
};

const parseInput = () => {
	const lines = input.split('\n').filter(l => l.trim());
	const ySize = lines.length;
	const xSize = Math.max(...lines.map(l => l.length));

	const track = makeArray(ySize, xSize, ' ');
	lines.forEach((l, y) => l.split('').forEach((c, x) => track[y][x] = c));

	const carts = [];
	for (let y = 0; y < track.length; y++) {
		for (let x = 0; x < track[y].length; x++) {
			const c = track[y][x];
			if ('^<>v'.includes(c)) {
				carts.push({ dir: c, pos: { x, y }, lastIntersection: 'right' });
				track[y][x] = ((track[y - 1] && '|+'.includes(track[y - 1][x])) || (track[y + 1] && '|+'.includes(track[y + 1][x]))) ? '|' : '-';
			}
		}
	}

	return { track, carts };
};

const run = (visualize, removeCollisions=false) => {
	let { track, carts } = parseInput();
	const toString = () => {
		const copy = track.slice().map(l => l.slice());
		carts.forEach(c => copy[c.pos.y][c.pos.x] = c.dir);
		return copy.map(l => l.join('')).join('\n');
	};
	const hasCollision = cart => carts.filter(c => c !== cart).some(c => c.pos.x === cart.pos.x && c.pos.y === cart.pos.y);
	return function*() {
		for (let i = 0; i < Infinity; i++) {
			if (visualize) yield `Num Carts: ${carts.length}\n${toString()}`;
			else if (i % 1000 === 0) yield `Num Carts: ${carts.length}`;
			carts.sort(sortBy(c => c.pos.y, c => c.pos.x)).forEach(cart => {
				if (cart.dead) return;

				const dir = DIRS[cart.dir];
				cart.pos.x += dir.dx;
				cart.pos.y += dir.dy;

				for (const c of carts.filter(c => c !== cart && !c.dead)) {
					if (c.pos.x === cart.pos.x && c.pos.y === cart.pos.y) {
						c.dead = true;
						cart.dead = true;
						return;
					}
				}

				const coord = track[cart.pos.y][cart.pos.x];
				if ('/\\'.includes(coord)) {
					cart.dir = dir.corners[coord];
				} else if (coord === '+') {
					cart.lastIntersection = (cart.lastIntersection === 'right') ? 'left' : (cart.lastIntersection === 'left') ? 'straight' : 'right';
					cart.dir = dir[cart.lastIntersection];
				}
			});
			if (removeCollisions) {
				carts = carts.filter(cart => !cart.dead);
				if (carts.length === 1) return yield `${carts[0].pos.x},${carts[0].pos.y}\n${toString()}`;
			} else {
				const collisions = carts.filter(hasCollision);
				if (collisions.length > 0) return yield `${collisions[0].pos.x},${collisions[0].pos.y}\n${toString()}`;
			}
		}
	};
};

export default {
	part1(visualize=false) {
		return run(visualize);
	},
	part2(visualize=false) {
		return run(visualize, true);
	},
	optionalVisualization: true,
	interval: 0
};
