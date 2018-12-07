import input from './input.js';

const parseInput = () =>
	input.split('\n')
		.map(str => {
			const match = str.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
			return {
				id: parseInt(match[1]),
				pos: {
					x: parseInt(match[2]),
					y: parseInt(match[3])
				},
				size: {
					x: parseInt(match[4]),
					y: parseInt(match[5])
				}
			};
		});

const getOverlappingCoords = (square1, square2) => {
	const overlapping = [];
	for (let x = square1.pos.x; x < square1.pos.x + square1.size.x; x++) {
		for (let y = square1.pos.y; y < square1.pos.y + square1.size.y; y++) {
			if (x >= square2.pos.x
				&& x < square2.pos.x + square2.size.x
				&& y >= square2.pos.y
				&& y < square2.pos.y + square2.size.y) {
				overlapping.push({ x, y });
			}
		}
	}
	return overlapping;
};

export default {
	part1() {
		const squares = parseInput();
		const overlapping = new Set();

		squares.forEach(square1 => {
			squares
				.filter(square2 => square2 !== square1)
				.forEach(
					square2 => getOverlappingCoords(square1, square2)
						.forEach(coord => overlapping.add(`${coord.x},${coord.y}`))
				);
		});

		return overlapping.size;
	},
	part2() {
		const squares = parseInput();
		return squares.filter(
			square1 => squares
				.filter(square2 => square2 !== square1)
				.every(square2 => getOverlappingCoords(square1, square2).length === 0)
		)[0].id;
	}
};
