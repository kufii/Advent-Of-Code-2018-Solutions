import input from './input.js';

const parseInput = () => input.split('\n').map(line => line.split(''));

export default {
	part1() {
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
		return function*() {
			let i;
			for (i = 0; i < 10; i++) {
				yield `Minutes: ${i}\n${toString()}`;
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
			const value = getCount('|') * getCount('#');
			yield `Value: ${value}\nMinutes: ${i}\n${toString()}`;
		};
	},
	part2() {
		return input;
	},
	interval: 1000
};
