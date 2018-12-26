import input from './input.js';
import { makeArray } from '../../util.js';

const parseInput = () => input.split('\n')
	.map(line => line.split(', ').map(n => parseInt(n)))
	.map(([x, y]) => ({ x, y }));

const getBounds = coords => ({
	minX: Math.min(...coords.map(coord => coord.x)),
	maxX: Math.max(...coords.map(coord => coord.x)),
	minY: Math.min(...coords.map(coord => coord.y)),
	maxY: Math.max(...coords.map(coord => coord.y))
});

const adjustCoords = coords => {
	const { minX, minY } = getBounds(coords);
	coords.forEach(coord => {
		coord.x -= minX;
		coord.y -= minY;
	});
	return coords;
};

const getDistanceToCoord = (coord, x, y) => Math.abs(coord.x - x) + Math.abs(coord.y - y);

const createGrid = coords => {
	const { maxX, maxY } = getBounds(coords);
	const grid = makeArray(maxY + 1, maxX + 1);

	const getClosestCoord = (x, y) => {
		const lengths = coords.map((coord, index) => ({ coord: index, distance: getDistanceToCoord(coord, x, y) }));
		const minDistance = Math.min(...lengths.map(length => length.distance));
		const closestCoords = lengths.filter(length => length.distance === minDistance).map(length => length.coord);
		return closestCoords.length > 1 ? null : closestCoords[0];
	};

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			grid[y][x] = getClosestCoord(x, y);
		}
	}

	return grid;
};

const iterate = function*(grid) {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			yield grid[y][x];
		}
	}
};

const iteratePerimeter = function*(grid) {
	if (grid.length === 0) return;
	for (let y = 0; y < grid.length; y++) {
		yield grid[y][0];
		if (grid[y].length > 1) yield grid[y][grid[y].length - 1];
	}
	for (let x = 1; x < grid[0].length - 1; x++) {
		yield grid[0][x];
		if (grid.length > 1) yield grid[grid.length - 1][x];
	}
};

const getNonInfiniteAreas = grid => {
	const set = new Set();

	for (const value of iterate(grid)) {
		if (value !== null) set.add(value);
	}
	for (const value of iteratePerimeter(grid)) {
		if (value !== null) set.delete(value);
	}

	return Array.from(set);
};

export default {
	part1() {
		const grid = createGrid(adjustCoords(parseInput()));
		const areas = getNonInfiniteAreas(grid);
		const values = Array.from(iterate(grid));
		const sizes = areas.map(area => values.filter(value => value === area).length);
		return Math.max(...sizes);
	},
	part2() {
		const coords = adjustCoords(parseInput());
		const { maxX, maxY } = getBounds(coords);
		let size = 0;
		for (let x = 0; x <= maxX; x++) {
			for (let y = 0; y <= maxY; y++) {
				if (coords.reduce((total, coord) => total + getDistanceToCoord(coord, x, y), 0) < 10000) size++;
			}
		}
		return size;
	}
};
