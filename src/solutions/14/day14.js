const INPUT = 635041;

const update = (recipes, current) => {
	recipes.push(...(recipes[current[0]] + recipes[current[1]]).toString().split('').map(n => parseInt(n)));
	current.forEach((value, i) => current[i] = (value + recipes[value] + 1) % recipes.length);
};

export default {
	part1() {
		const recipes = [3, 7];
		const current = [0, 1];
		while (recipes.length < INPUT + 10) {
			update(recipes, current);
		}
		return recipes.slice(INPUT, INPUT + 10).join('');
	},
	part2() {
		return function*() {
			const str = INPUT.toString();
			const recipes = [3, 7];
			const current = [0, 1];
			let i = 0;
			while (!recipes.slice(-(str.length + 1)).join('').includes(str)) {
				update(recipes, current);
				i++;
				if (i % 1000 === 0) yield 'This is slow...';
			}
			return yield recipes.join('').indexOf(str);
		};
	},
	interval: 0
};
