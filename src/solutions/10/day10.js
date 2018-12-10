import input from './input.js';
import { makeArray } from '../../util.js';

const parseInput = () => input.split('\n').map(line => {
	const [_, x, y, velX, velY] = line.match(/^position=<([ \d-]+),([ \d-]+)> velocity=<([ \d-]+),([ \d-]+)>$/i);
	return {
		pos: {
			x: parseInt(x),
			y: parseInt(y)
		},
		velocity: {
			x: parseInt(velX),
			y: parseInt(velY)
		}
	};
});

const getBounds = coords => ({
	minX: Math.min(...coords.map(c => c.pos.x)),
	minY: Math.min(...coords.map(c => c.pos.y)),
	maxX: Math.max(...coords.map(c => c.pos.x)),
	maxY: Math.max(...coords.map(c => c.pos.y))
});

const adjustCoords = coords => {
	const { minX, minY } = getBounds(coords);
	coords.forEach(c => {
		c.pos.x -= minX;
		c.pos.y -= minY;
	});
	return coords;
};

const run = function*() {
	const coords = parseInput();

	const fillArray = (arr, coords) => coords.forEach(c => arr[c.pos.y][c.pos.x] = '#');
	const toString = arr => arr.map(line => line.join('')).join('\n');
	const update = () => {
		coords.forEach(c => {
			c.pos.x += c.velocity.x;
			c.pos.y += c.velocity.y;
		});
	};

	let found = false;
	let seconds = 0;
	while (true) {
		const { minX, minY, maxX, maxY } = getBounds(coords);
		if (maxX - minX < 100 && maxY - minY < 100) {
			found = true;
			const adjusted = adjustCoords(coords);
			const array = makeArray(maxY - minY + 1, maxX - minX + 1, ' ');
			fillArray(array, adjusted);
			yield `Seconds: ${seconds}\n${toString(array)}`;
		} else if (found) {
			break;
		}
		update();
		seconds++;
	}
};

export default {
	part1() {
		return run;
	},
	part2() {
		return run;
	}
};
