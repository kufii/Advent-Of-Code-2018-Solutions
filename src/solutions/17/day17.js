import input from './input.js';
import { makeArray } from '../../util.js';

const parseInput = () => {
	const coords = input.split('\n').map(line => {
		const [_, x] = line.match(/x=(\d+\.?\.?(?:\d+)?)/);
		const [__, y] = line.match(/y=(\d+\.?\.?(?:\d+)?)/);
		const parse = str => {
			if (str.includes('..')) {
				const [from, to] = str.split('..');
				return { from: parseInt(from), to: parseInt(to) };
			}
			return { from: parseInt(str), to: parseInt(str) };
		};
		return { x: parse(x), y: parse(y) };
	});
	const minX = Math.min(...coords.map(c => c.x.from));
	const maxX = Math.max(...coords.map(c => c.x.to));
	const minY = Math.min(...coords.map(c => c.y.from));
	const maxY = Math.max(...coords.map(c => c.y.to));
	const arr = makeArray(maxY + 1, maxX - minX + 3, ' ');
	coords.forEach(({ x, y }) => {
		for (let yy = y.from; yy <= y.to; yy++) {
			for (let xx = x.from; xx <= x.to; xx++) {
				arr[yy][xx - minX + 1] = '#';
			}
		}
	});
	arr[minY][500 - minX + 1] = '|';
	return arr;
};

const run = visualize => {
	const arr = parseInput();
	const toString = () => `<pre style="font-size: 10px;">${
		arr.map(
			line => line.map(c => '~|'.includes(c) ? `<span style="color: blue">${c}</span>` : c).join('')
		).join('\n')
	}</pre>`;
	const getCount = tile => arr.map(line => line.reduce((count, a) => count + (a === tile ? 1 : 0), 0))
		.reduce((count, num) => count + num, 0);

	return function*() {
		let unresolved = [];
		arr.forEach((line, y) => line.forEach((cell, x) => cell === '|' ? unresolved.push({ x, y }) : null));

		const fill = (x, y) => {
			for (let yy = y; yy >= 0; yy--) {
				let xx;
				let overflow = false;
				const checkOverflow = () => {
					if (' |'.includes(arr[yy + 1][xx])) {
						arr[yy][xx] = '|';
						overflow = true;
						if (arr[yy + 1][xx] === ' ') unresolved.push({ x: xx, y: yy });
						return true;
					}
					return false;
				};
				for (xx = x; arr[yy][xx] !== '#'; xx--) {
					arr[yy][xx] = '~';
					if (checkOverflow()) break;
				}
				for (xx = x + 1; arr[yy][xx] !== '#'; xx++) {
					arr[yy][xx] = '~';
					if (checkOverflow()) break;
				}
				if (overflow) {
					for (xx = x; arr[yy][xx] === '~'; xx--) {
						arr[yy][xx] = '|';
					}
					for (xx = x + 1; arr[yy][xx] === '~'; xx++) {
						arr[yy][xx] = '|';
					}
					break;
				}
			}
		};

		while (unresolved.length > 0) {
			if (visualize) yield toString();
			for (const pos of unresolved.slice()) {
				let y;
				for (y = pos.y + 1; y < arr.length && arr[y][pos.x] === ' '; y++) {
					arr[y][pos.x] = '|';
				}
				y--;
				if (y < arr.length - 1 && !' |'.includes(arr[y + 1][pos.x])) fill(pos.x, y);
				unresolved = unresolved.filter(p => p !== pos);
			}
		}
		const stillWater = getCount('~');
		const runningWater = getCount('|');
		const result = `Total Water: ${stillWater + runningWater}\nStill Water: ${stillWater}`;
		yield visualize ? `${result}\n${toString()}` : result;
	};
};

export default {
	part1(visualize) {
		return run(visualize);
	},
	part2(visualize) {
		return run(visualize);
	},
	interval: 1000,
	optionalVisualization: true,
	html: true
};
