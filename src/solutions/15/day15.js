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
	const distances = {};
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

const aliveUnits = units => units.filter(({ hp }) => hp > 0);
const getGoblins = units => aliveUnits(units).filter(({ type }) => type === 'G');
const getElves = units => aliveUnits(units).filter(({ type }) => type === 'E');
const toString = (terrain, units) => {
	const board = terrain.slice().map(line => line.map(square => square ? '#' : ' '));
	aliveUnits(units).forEach(({ type, pos }) => board[pos.y][pos.x] = type);
	return board.map(line => line.join('')).join('\n');
};

const runRound = (terrain, units) =>
	aliveUnits(units).sort(sortBy(({ pos }) => pos.y, ({ pos }) => pos.x)).every(unit => {
		if (unit.hp <= 0) return true;
		const enemies = unit.type === 'G' ? getElves(units) : getGoblins(units);
		if (enemies.length === 0) return false;

		const adjacentEnemy = () => enemies.filter(
			({ pos }) => Array.from(neighbors(unit.pos)).some(
				({ x, y }) => pos.x === x && pos.y === y
			)
		).sort(sortBy(
			({ hp }) => hp,
			({ pos }) => pos.y,
			({ pos }) => pos.x
		))[0];

		const move = () => {
			const paths = enemies.map(e => dijkstra(terrain, aliveUnits(units), unit.pos, e.pos)).filter(p => p).sort(sortBy(p => p.length));
			if (paths.length === 0) return;

			if (paths[0].length > 1) {
				const { x, y } = paths.sort(
					sortBy(
						p => p.length,
						p => p[p.length - 2].y,
						p => p[p.length - 2].x
					)
				)[0][0];
				unit.pos.x = x;
				unit.pos.y = y;
			}
		};

		let enemy = adjacentEnemy();
		if (!enemy) move();
		enemy = adjacentEnemy();
		if (enemy) {
			enemy.hp -= unit.atk;
		}

		return true;
	});

const run = function*(terrain, units, visualize) {
	let rounds = 0;
	if (!visualize) yield 'Running...';
	while (true) {
		if (!visualize && rounds % 5 === 0) yield 'Runnning...';
		if (visualize) yield `Round: ${rounds}\n${toString(terrain, units)}`;
		if (!runRound(terrain, units)) break;
		rounds++;
	}
	const score = rounds * aliveUnits(units).reduce((count, { hp }) => count + hp, 0);
	yield `Score: ${score}\nRound: ${rounds}\n${toString(terrain, units)}`;
};

export default {
	part1(visualize) {
		const { terrain, units } = parseInput();
		return function*() {
			for (const out of run(terrain, units, visualize)) {
				yield out;
			}
		};
	},
	part2(visualize) {
		return function*() {
			for (let atk = 4; atk < Infinity; atk++) {
				const { terrain, units } = parseInput();
				const elves = getElves(units);
				const numElves = elves.length;
				elves.forEach(e => e.atk = atk);
				let cont = false;
				for (const out of run(terrain, units, visualize)) {
					yield `Attack: ${atk}\n${out}`;
					if (getElves(units).length !== numElves) {
						cont = true;
						break;
					}
				}
				if (!cont) break;
			}
		};
	},
	interval: 0,
	optionalVisualization: true
};
