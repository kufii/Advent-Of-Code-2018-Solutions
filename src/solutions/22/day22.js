import input from './input.js';
import { makeArray } from '../../util.js';

const parseInput = () => {
	let [depth, target] = input.split('\n');
	depth = parseInt(depth.split(' ')[1]);
	const [x, y] = target.split(' ')[1].split(',');
	return {
		depth,
		target: {
			x: parseInt(x),
			y: parseInt(y)
		}
	};
};

const getCave = (depth, target) => {
	const arr = makeArray(target.y + 1, target.x + 1);
	for (let y = 0; y < arr.length; y++) {
		for (let x = 0; x < arr[y].length; x++) {
			const geologic = x === 0 && y === 0 ? 0
				: x === 0 ? y * 48271
				: y === 0 ? x * 16807
				: arr[y][x - 1].erosion * arr[y - 1][x].erosion;
			const erosion = (geologic + depth) % 20183;
			arr[y][x] = { geologic, erosion };
		}
	}
	return arr;
};

const iterarateCells = function*(arr, start, end) {
	if (!end) [start, end] = [{ x: 0, y: 0 }, start];
	for (let y = start.y; y <= end.y; y++) {
		for (let x = start.x; x <= end.x; x++) {
			yield arr[y][x];
		}
	}
};

export default {
	part1() {
		const { depth, target } = parseInput();
		const cave = getCave(depth, target);
		return Array.from(iterarateCells(cave, target))
			.map(c => c.erosion % 3)
			.reduce((a, b) => a + b, 0);
	},
	part2() {
		return input;
	}
};
