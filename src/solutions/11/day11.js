import { makeArray, maxBy } from '../../util.js';

const SERIAL_NUM = 5535;

const createSummedTable = () => {
	const array = makeArray(301, 301, 0);
	for (let y = 1; y < array.length; y++) {
		for (let x = 1; x < array[y].length; x++) {
			const rackId = x + 10;
			const power = Math.floor((((rackId * y) + SERIAL_NUM) * rackId) % 1000 / 100) - 5;
			array[y][x] = power + array[y - 1][x] + array[y][x - 1] - array[y - 1][x - 1];
		}
	}
	return array;
};

const getPowers = function*(array, size) {
	for (let y = size; y < array.length; y++) {
		for (let x = size; x < array[y].length; x++) {
			const power = array[y][x] - array[y - size][x] - array[y][x - size] + array[y - size][x - size];
			yield { y: y - size + 1, x: x - size + 1, power };
		}
	}
};

export default {
	part1() {
		const array = createSummedTable();
		const square = Array.from(getPowers(array, 3)).reduce(maxBy(a => a.power));
		return `${square.x},${square.y}`;
	},
	part2() {
		const array = createSummedTable();
		return function*() {
			const powers = {};
			for (let size = 1; size < array.length; size++) {
				powers[size] = Array.from(getPowers(array, size)).reduce(maxBy(a => a.power));
				yield `Calculated ${size} of ${array.length - 1}`;
			}
			yield Object.entries(powers)
				.map(([key, value]) => ({ id: `${value.x},${value.y},${key}`, power: value.power }))
				.reduce(maxBy(a => a.power))
				.id;
		};
	},
	interval: 0
};
