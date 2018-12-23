import input from './input.js';
import { makeArray, sortBy } from '../../util.js';

const parseInput = () => {
	let [depth, target] = input.split('\n');
	depth = parseInt(depth.split(' ')[1]);
	const [x, y] = target.split(' ')[1].split(',').map(n => parseInt(n));
	return {
		depth,
		target: { x, y }
	};
};

const getCellData = (arr, depth, target, x, y) => {
	const geologic = x === 0 && y === 0 ? 0
		: x === target.x && y === target.y ? 0
		: x === 0 ? y * 48271
		: y === 0 ? x * 16807
		: arr[y][x - 1].erosion * arr[y - 1][x].erosion;
	const erosion = (geologic + depth) % 20183;
	const type = erosion % 3;
	return { geologic, erosion, type };
};

const getCave = (depth, target, size) => {
	if (!size) size = { x: target.x + 1, y: target.y + 1 };
	const arr = makeArray(size.y, size.x);
	for (let y = 0; y < arr.length; y++) {
		for (let x = 0; x < arr[y].length; x++) {
			arr[y][x] = getCellData(arr, depth, target, x, y);
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

const TOOLS = {
	0: ['T', 'C'],
	1: ['C', 'N'],
	2: ['T', 'N']
};

const dijkstra = function*(cave, start, end, yieldEvery=1000) {
	const key = (x, y, tool) => `${x},${y},${tool}`;
	const toolsFor = (x, y) => TOOLS[cave[y][x]];

	const neighbors = (x, y, tool) => {
		const arr = [];
		const push = (x, y) => {
			if (x < 0 || y < 0 || y >= cave.length || x >= cave[y].length) return;
			if (toolsFor(x, y).includes(tool)) arr.push({ x, y });
		};
		push(x - 1, y);
		push(x + 1, y);
		push(x, y - 1);
		push(x, y + 1);
		return arr;
	};

	let heap = [[0, start.x, start.y, start.tool]];
	const times = {};
	const getTime = (x, y, tool) => times[key(x, y, tool)] || Infinity;
	let i = 1;
	while (heap.length > 0) {
		if (i++ % yieldEvery === 0) yield 'Running...';
		const [min, x, y, tool] = heap.shift();
		const bestTime = getTime(x, y, tool);

		if (bestTime <= min) continue;
		if (x === end.x && y === end.y && tool === end.tool) {
			return yield min;
		}

		times[key(x, y, tool)] = min;

		toolsFor(x, y)
			.filter(t => t !== tool)
			.filter(t => getTime(x, y, t) > min + 7)
			.forEach(t => heap.push([min + 7, x, y, t]));

		neighbors(x, y, tool)
			.filter(({ x, y }) => getTime(x, y, tool) > min + 1)
			.forEach(({ x, y }) => heap.push([min + 1, x, y, tool]));

		const temp = {};
		heap.sort(sortBy(([min]) => min)).forEach(([min, x, y, tool]) => {
			if (!temp[key(x, y, tool)]) {
				temp[key(x, y, tool)] = [min, x, y, tool];
			}
		});
		heap = Object.entries(temp).map(([_, value]) => value);
	}
};

export default {
	part1() {
		const { depth, target } = parseInput();
		const cave = getCave(depth, target);
		return Array.from(iterarateCells(cave, target))
			.map(c => c.type)
			.reduce((a, b) => a + b, 0);
	},
	part2() {
		const { depth, target } = parseInput();
		const cave = getCave(depth, target, { x: target.x + 50, y: target.y + 10 })
			.map(line => line.map(c => c.type));
		target.tool = 'T';
		return function*() {
			for (const out of dijkstra(cave, { x: 0, y: 0, tool: 'T' }, target)) {
				yield out;
			}
		};
	}
};
