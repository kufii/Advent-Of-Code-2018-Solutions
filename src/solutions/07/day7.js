import input from './input.js';
import { groupBy, sortBy, makeArray } from '../../util.js';

const parseInput = () => {
	const steps = input.split('\n')
		.map(line => {
			const [dependsOn, step] = line.match(/^Step ([A-Z]) must be finished before step ([A-Z])/i).slice(1);
			return { step, dependsOn };
		})
		.reduce(groupBy(a => a.step, a => a.dependsOn), {});

	Object.entries(steps).forEach(([_, dependsOn]) => {
		dependsOn.forEach(step => {
			if (!steps[step]) steps[step] = [];
		});
	});

	return steps;
};

const completeStep = (steps, step) => {
	steps = steps.filter(({ step: step2 }) => step2 !== step);
	steps.forEach(obj => obj.dependsOn = obj.dependsOn.filter(step2 => step2 !== step));
	return steps;
};

export default {
	part1() {
		let steps = Object.entries(parseInput()).map(([step, dependsOn]) => ({ step, dependsOn }));
		const exec = [];
		while (steps.length > 0) {
			const { step } = steps.filter(({ dependsOn }) => dependsOn.length === 0).sort(sortBy(({ step }) => step))[0];
			exec.push(step);
			steps = completeStep(steps, step);
		}
		return exec.join('');
	},
	part2() {
		const BASE_TIME_PER_STEP = 60;
		const NUM_WORKERS = 5;

		let steps = Object.entries(parseInput()).map(([step, dependsOn]) => ({ step, dependsOn, time: BASE_TIME_PER_STEP + step.charCodeAt(0) - 64 }));
		let time = 0;

		const work = makeArray(NUM_WORKERS);
		const activeWork = () => work.filter(w => w);
		const inactiveWork = () => work.filter(w => !w);

		while (steps.length > 0) {
			steps.filter(({ dependsOn }) => dependsOn.length === 0)
				.filter(({ step }) => !activeWork().some(w => w.step === step))
				.sort(sortBy(({ step }) => step))
				.slice(0, inactiveWork().length)
				.forEach(step => work[work.indexOf(null)] = step);

			const minTime = Math.min(...activeWork().map(({ time }) => time));
			time += minTime;
			work.forEach((step, index) => {
				if (!step) return;
				step.time -= minTime;
				if (step.time === 0) {
					work[index] = null;
					steps = completeStep(steps, step.step);
				}
			});
		}

		return time;
	}
};
