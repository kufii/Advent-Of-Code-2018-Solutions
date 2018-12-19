import input from './input.js';
import { sortBy } from '../../util.js';

const parseInput = () => {
	const terrain = input.split('\n').map(line => line.split(''));
	const units = [];
	terrain.forEach((line, y) => line.forEach((c, x) => {
		terrain[y][x] = c === '#';
		if ('GE'.includes(c)) {
			units.push({
				type: c,
				pos: { x, y },
				hp: 200,
				atk: 3
			});
		}
	}));
	return { terrain, units };
};

const neighbors = function*({ x, y }) {
	yield { x, y: y - 1 };
	yield { x: x - 1, y };
	yield { x: x + 1, y };
	yield { x, y: y + 1 };
};

const dijkstra = (terrain, units, start, end) => {
	const map = terrain.map(
		(line, y) => line.map(
			(isWall, x) => isWall || units.some(({ pos }) => pos.x === x && pos.y === y)
		)
	);
	map[start.y][start.x] = false;
	map[end.y][end.x] = false;
	const key = pos => `${pos.x},${pos.y}`;
	const visited = [];
	let unvisited = [];
	const distances = { };
	const getDistance = pos => distances[key(pos)] || { distance: Infinity };
	distances[key(start)] = { distance: 0 };
	let current = start;
	while (current) {
		unvisited.push(
			...Array.from(neighbors(current))
				.filter(({ x, y }) => !map[y][x])
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
		if (current.x === end.x && current.y === end.y) {
			const route = [end];
			let distance = getDistance(end);
			while (distance.previous) {
				route.push(distance.previous);
				distance = getDistance(distance.previous);
			}
			return route.reverse().slice(1);
		}
		current = unvisited.sort(sortBy(a => distances[key(a)].distance, a => a.y, a => a.x))[0];
	}
	return null;
};

export default {
	part1() {
		const { terrain, units } = parseInput();
		const toString = () => {
			const board = terrain.slice().map(line => line.map(square => square ? '#' : ' '));
			aliveUnits().forEach(({ type, pos }) => board[pos.y][pos.x] = type);
			return board.map(line => line.join('')).join('\n');
		};
		const aliveUnits = () => units.filter(({ hp }) => hp > 0);
		const getGoblins = () => aliveUnits().filter(({ type }) => type === 'G');
		const getElves = () => aliveUnits().filter(({ type }) => type === 'E');
		return function*() {
			let rounds = 0;
			while (true) {
				yield `Round: ${rounds}\n${toString()}`;
				if (!aliveUnits().sort(sortBy(({ pos }) => pos.y, ({ pos }) => pos.x)).every(unit => {
					if (unit.hp < 0) return true;
					const enemies = unit.type === 'G' ? getElves() : getGoblins();
					if (enemies.length === 0) return false;
					const paths = enemies.map(e => dijkstra(terrain, aliveUnits(), unit.pos, e.pos)).filter(p => p).sort(sortBy(p => p.length));
					if (paths.length === 0) return true;

					if (paths[0].length > 1) {
						const { x, y } = paths.sort(
							sortBy(
								p => p.length,
								p => p[p.length - 1].y,
								p => p[p.length - 1].x
							)
						)[0][0];
						unit.pos.x = x;
						unit.pos.y = y;
					}

					const enemy = enemies.filter(
						({ pos }) => Array.from(neighbors(unit.pos)).some(
							({ x, y }) => pos.x === x && pos.y === y
						)
					).sort(sortBy(
						({ hp }) => hp,
						({ pos }) => pos.y,
						({ pos }) => pos.x
					))[0];
					if (enemy) {
						enemy.hp -= unit.atk;
					}

					return true;
				})) break;
				rounds++;
			}
			const score = rounds * aliveUnits().reduce((count, { hp }) => count + hp, 0);
			yield `Score: ${score}\nRound: ${rounds}\n${toString()}`;
		};
	},
	part2() {
		return input;
	},
	interval: 0
};
