import input from './input.js';
import { sortBy, desc } from '../../util.js';

const parseInput = () =>
	input
		.split('\n\n')
		.map(chunk => chunk.trim().split('\n').slice(1))
		.map(army =>
			army.map(line => {
				console.log(line);
				let [units, hp, resistances, atk, type, initiative] = line
					.match(/^(\d+) units each with (\d+) hit points (\(.+\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)$/)
					.slice(1);
				[units, hp, atk, initiative] = [units, hp, atk, initiative].map(n => parseInt(n));
				const [weaknesses=[]] = ((resistances || '').match(/weak to ([\w, ]+)/) || []).slice(1).map(str => str.split(', '));
				const [immunities=[]] = ((resistances || '').match(/immune to ([\w, ]+)/) || []).slice(1).map(str => str.split(', '));
				return { units, hp, atk, type, initiative, weaknesses, immunities };
			}));

export default {
	part1() {
		const [immune, infection] = parseInput();
		immune.forEach(u => u.army = 'immune');
		infection.forEach(u => u.army = 'infection');
		const aliveImmune = () => immune.filter(({ units }) => units > 0);
		const aliveInfection = () => infection.filter(({ units }) => units > 0);
		const units = () => [...aliveImmune(), ...aliveInfection()];

		while (aliveImmune().length > 0 && aliveInfection().length > 0) {
			let availableImmune = aliveImmune();
			let availableInfection = aliveInfection();
			const targets = [];
			const addTarget = (unit, enemies) => {
				const target = {
					unit,
					target: enemies
						.filter(e => !e.immunities.includes(unit.type))
						.sort(sortBy(
							desc(({ weaknesses }) => unit.atk * unit.units * (weaknesses.includes(unit.type) ? 2 : 1)),
							desc(e => e.atk * e.units),
							desc(e => e.initiative)
						))[0]
				};
				if (target.target) {
					targets.push(target);
					availableImmune = availableImmune.filter(u => u !== target.target);
					availableInfection = availableInfection.filter(u => u !== target.target);
				}
			};
			units()
				.sort(sortBy(desc(u => u.atk * u.units), desc(u => u.initiative)))
				.forEach(u => addTarget(u, u.army === 'immune' ? availableInfection : availableImmune));
			targets
				.sort(sortBy(desc(({ unit }) => unit.initiative)))
				.forEach(({ unit, target }) => {
					if (unit.units <= 0) return;
					const power = unit.atk * unit.units * (target.weaknesses.includes(unit.type) ? 2 : 1);
					target.units -= Math.floor(power / target.hp);
				});
		}

		return units().reduce((count, { units }) => count + units, 0);
	},
	part2() {
		return input;
	}
};
