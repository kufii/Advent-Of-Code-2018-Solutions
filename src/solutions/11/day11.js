import { makeArray, maxBy } from '../../util.js';

const SERIAL_NUM = 5535;

const createArray = () => {
	const array = makeArray(300, 300);
	for (let y = 0; y < array.length; y++) {
		for (let x = 0; x < array[y].length; x++) {
			const rackId = x + 11;
			const power = Math.floor((((rackId * (y + 1)) + SERIAL_NUM) * rackId) % 1000 / 100) - 5;
			array[y][x] = power;
		}
	}
	return array;
};

const getSquarePower = (array, yStart, xStart, ySize, xSize) => {
	let power = 0;
	for (let y = yStart; y < yStart + ySize; y++) {
		for (let x = xStart; x < xStart + xSize; x++) {
			power += array[y][x];
		}
	}
	return power;
};

const getPowers = function*(array, size) {
	for (let y = 0; y <= array.length - size; y++) {
		for (let x = 0; x <= array[y].length - size; x++) {
			yield { y: y + 1, x: x + 1, power: getSquarePower(array, y, x, size, size) };
		}
	}
};

export default {
	part1() {
		const array = createArray();
		const square = Array.from(getPowers(array, 3)).reduce(maxBy(a => a.power));
		return `${square.x},${square.y}`;
	},
	part2() {
		const array = createArray();
		return function*() {
			const powers = {};
			for (let size = 1; size <= array.length; size++) {
				powers[size] = Array.from(getPowers(array, size)).reduce(maxBy(a => a.power));
				yield `Calculated ${size} of ${array.length}`;
			}
			yield Object.entries(powers)
				.map(([key, value]) => ({ id: `${value.x},${value.y},${key}`, power: value.power }))
				.reduce(maxBy(a => a.power))
				.id;
		};
	},
	interval: 0
};
