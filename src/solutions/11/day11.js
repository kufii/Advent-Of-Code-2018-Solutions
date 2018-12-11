import { makeArray, maxBy, SummedAreaTable } from '../../util.js';

const SERIAL_NUM = 5535;

const createSummedTable = () => {
	const array = makeArray(300, 300);
	for (let y = 0; y < array.length; y++) {
		for (let x = 0; x < array[y].length; x++) {
			const rackId = x + 11;
			const power = Math.floor((((rackId * (y + 1)) + SERIAL_NUM) * rackId) % 1000 / 100) - 5;
			array[y][x] = power;
		}
	}
	return new SummedAreaTable(array);
};

const getPowers = function*(sums, size) {
	for (let y = 1; y <= sums.height - size; y++) {
		for (let x = 1; x <= sums.width - size; x++) {
			const power = sums.calculateArea(x, y, size, size);
			yield { y, x, power };
		}
	}
};

export default {
	part1() {
		const sums = createSummedTable();
		const square = Array.from(getPowers(sums, 3)).reduce(maxBy(a => a.power));
		return `${square.x},${square.y}`;
	},
	part2() {
		const sums = createSummedTable();
		return function*() {
			const powers = {};
			for (let size = 1; size < sums.width; size++) {
				powers[size] = Array.from(getPowers(sums, size)).reduce(maxBy(a => a.power));
				yield `Calculated ${size} of ${sums.width - 1}`;
			}
			yield Object.entries(powers)
				.map(([key, value]) => ({ id: `${value.x},${value.y},${key}`, power: value.power }))
				.reduce(maxBy(a => a.power))
				.id;
		};
	},
	interval: 0
};
