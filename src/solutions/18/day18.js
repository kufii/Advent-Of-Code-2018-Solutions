import input from './input.js';

const parseInput = () => input.split('\n').map(line => line.split(''));

const run = function*(times, visualize) {
	let area = parseInput();
	const toString = () => area.map(line => line.join('')).join('\n');
	const getCount = type => area.map(line => line.filter(cell => cell === type).length).reduce((count, n) => count + n, 0);
	const adjacent = function*(x, y) {
		for (let yy = y - 1; yy <= y + 1; yy++) {
			for (let xx = x - 1; xx <= x + 1; xx++) {
				if (xx < 0 || yy < 0 || yy >= area.length || xx >= area[yy].length || (xx === x && yy === y)) {
					continue;
				}
				yield { x: xx, y: yy };
			}
		}
	};
	const getValue = () => getCount('|') * getCount('#');
	const history = [];

	for (let i = 0; i < times; i++) {
		if (visualize) yield `Minutes: ${i}\n${toString()}`;

		const serial = JSON.stringify(area);
		const index = history.indexOf(serial);
		if (index !== -1) {
			const cycle = i - index;
			const remaining = (times - i) % cycle;
			area = JSON.parse(history.slice(index)[remaining]);
			break;
		}
		history.push(serial);

		area = area.map((line, y) => line.map((cell, x) => {
			const neighbors = Array.from(adjacent(x, y));
			return {
				'.': () => neighbors.filter(({ x, y }) => area[y][x] === '|').length >= 3 ? '|' : '.',
				'|': () => neighbors.filter(({ x, y }) => area[y][x] === '#').length >= 3 ? '#' : '|',
				'#': () => neighbors.some(({ x, y }) => area[y][x] === '#')
					&& neighbors.some(({ x, y }) => area[y][x] === '|') ? '#' : '.'
			}[cell]();
		}));
	}
	if (visualize) {
		yield `Value: ${getValue()}\nMinutes: ${times}\n${toString()}`;
	} else {
		yield getValue();
	}
};

export default {
	part1(visualize) {
		return function*() {
			for (const out of run(10, visualize)) {
				yield out;
			}
		};
	},
	part2(visualize) {
		return function*() {
			for (const out of run(1000000000, visualize)) {
				yield out;
			}
		};
	},
	interval: 100,
	optionalVisualization: true
};
