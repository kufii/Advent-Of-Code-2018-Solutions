import input from './input.js';

const key = ({ x, y, z, t }) => `${x},${y},${z},${t}`;
const toPos = key => {
	const [x, y, z, t] = key.split(',');
	return { x, y, z, t };
};

const parseInput = () => input.split('\n').map(toPos);

const distance = (pos1, pos2) =>
	Math.abs(pos1.x - pos2.x)
	+ Math.abs(pos1.y - pos2.y)
	+ Math.abs(pos1.z - pos2.z)
	+ Math.abs(pos1.t - pos2.t);

export default {
	part1() {
		let points = parseInput();
		const constellations = [];

		while (points.length > 0) {
			const constellation = new Set([key(points[0])]);
			let prevSize = 0;
			while (prevSize !== constellation.size) {
				prevSize = constellation.size;
				Array.from(constellation)
					.map(toPos)
					.forEach(
						pos1 => points
							.filter(pos2 => distance(pos1, pos2) <= 3)
							.forEach(pos => constellation.add(key(pos)))
					);
			}
			points = points.filter(p => !constellation.has(key(p)));
			constellations.push(constellation);
		}

		return constellations.length;
	},
	part2() {
		return 'Done Advent of Code 2018!';
	}
};
