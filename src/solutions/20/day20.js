import input from './input.js';

const indexOfClosingParen = (str, index) => {
	let numParen = 1;
	for (let i = index + 1; i < str.length; i++) {
		if (str[i] === '(') numParen++;
		else if (str[i] === ')') {
			numParen--;
			if (numParen === 0) return i;
		}
	}
	return -1;
};

const DIRS = {
	N: { dx: 0, dy: -1, opposite: 'S' },
	E: { dx: 1, dy: 0, opposite: 'W' },
	S: { dx: 0, dy: 1, opposite: 'N' },
	W: { dx: -1, dy: 0, opposite: 'E' }
};

const parseInput = () => {
	const rooms = [{ x: 0, y: 0, doors: new Set() }];
	const parse = (str, room) => {
		let prev = room;
		for (let i = 0; i < str.length; i++) {
			const dir = str[i];
			if (dir === '(') {
				const contents = str.slice(i + 1, indexOfClosingParen(str, i));
				i += contents.length + 1;
				parse(contents, prev);
			} else if (dir === '|') {
				prev = room;
			} else if (dir !== ')') {
				prev.doors.add(dir);
				let { x, y } = prev;
				x += DIRS[dir].dx;
				y += DIRS[dir].dy;
				const exists = rooms.find(room => room.x === x && room.y === y);
				if (exists) {
					exists.doors.add(DIRS[dir].opposite);
					prev = exists;
				} else {
					const newRoom = { x, y, doors: new Set() };
					newRoom.doors.add(DIRS[dir].opposite);
					rooms.push(newRoom);
					prev = newRoom;
				}
			}
		}
	};
	parse(input.match(/^\^(.*)\$$/)[1], rooms[0]);
	return rooms;
};

const dijkstra = (rooms, start) => {
	const neighbors = ({ x, y, doors }) => {
		const adjacent = [];
		for (const door of doors) {
			const { dx, dy } = DIRS[door];
			adjacent.push(rooms.find(room => room.x === x + dx && room.y === y + dy));
		}
		return adjacent;
	};

	const visited = [];
	let unvisited = [];

	const distances = {};
	const key = ({ x, y }) => `${x},${y}`;
	const getDistance = pos => distances[key(pos)] || { distance: Infinity };
	distances[key(start)] = { distance: 0 };

	let current = start;
	while (current) {
		unvisited.push(
			...neighbors(current)
				.filter(({ x, y }) => !unvisited.some(n => n.x === x && n.y === y))
				.filter(({ x, y }) => !visited.some(n => n.x === x && n.y === y))
		);
		unvisited.forEach(pos => {
			const distance = getDistance(current).distance + 1;
			if (distance < getDistance(pos).distance) {
				distances[key(pos)] = { distance, previous: current };
			}
		});
		unvisited = unvisited.filter(n => n !== current);
		visited.push(current);
		current = unvisited[0];
	}
	return distances;
};

export default {
	part1() {
		const rooms = parseInput();
		const distances = dijkstra(rooms, rooms[0]);
		return Math.max(...Object.entries(distances).map(([_, { distance }]) => distance));
	},
	part2() {
		const rooms = parseInput();
		const distances = dijkstra(rooms, rooms[0]);
		return Object.entries(distances).filter(([_, { distance }]) => distance >= 1000).length;
	}
};
