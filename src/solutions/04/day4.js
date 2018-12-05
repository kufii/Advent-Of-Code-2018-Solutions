import { loadInput, maxBy } from '../../util.js';

const FILE = 'day4';

const parseInput = () => loadInput(FILE)
	.then(
		data => {
			const guards = {};

			let lastId;
			let lastTime;

			data.split('\n')
				.map(str => {
					const match = str.match(/^\[(.*)\] (.*)/);
					return {
						time: new Date(match[1]),
						cmd: match[2]
					};
				})
				.sort((a, b) => a.time - b.time)
				.forEach(({ time, cmd }) => {
					const match = cmd.match(/#(\d+)/);
					const id = match ? parseInt(match[1]) : null;

					if (id) {
						lastId = id;
						if (!guards[id]) {
							guards[id] = {
								days: {},
								totalSleep: 0,
								totalAwake: 0
							};
						}
					} else {
						const date = time.toLocaleDateString();
						if (!guards[lastId].days[date]) {
							guards[lastId].days[date] = {
								asleep: [],
								awake: []
							};
						}
						const day = guards[lastId].days[date];
						const timespan = { from: lastTime, to: time };
						if (cmd === 'wakes up') {
							day.asleep.push(timespan);
							guards[lastId].totalSleep += timespan.to - timespan.from;
						} else {
							day.awake.push(timespan);
							guards[lastId].totalAwake += timespan.to - timespan.from;
						}
					}

					lastTime = time;
				});

			return Object.entries(guards).map(([key, value]) => {
				const guard = value;
				guard.id = key;
				return guard;
			});
		}
	);

const getMinute = time => (time.getHours() * 60) + time.getMinutes();

const getMinuteFrequency = guard => {
	const minutes = {};
	for (let i = 0; i < 24 * 60; i++) {
		minutes[i] = Object.entries(guard.days)
			.map(
				([_, value]) => value.asleep
					.filter(span => i >= getMinute(span.from) && i < getMinute(span.to)).length
			).reduce((a, b) => a + b, 0);
	}
	return minutes;
};

export default {
	async part1() {
		const guard = maxBy((await parseInput()), guard => guard.totalSleep);

		const minutes = getMinuteFrequency(guard);

		const mostSleptMinute = maxBy(
			Object.entries(minutes).map(([key, value]) => ({ minute: parseInt(key), value })),
			minute => minute.value
		).minute;

		return guard.id * mostSleptMinute;
	},
	async part2() {
		const frequencies = (await parseInput()).map(guard => {
			const minutes = getMinuteFrequency(guard);
			return {
				id: guard.id,
				minutes,
				maxFrequency: maxBy(
					Object.entries(minutes).map(([key, value]) => ({ minute: parseInt(key), value })),
					minute => minute.value
				)
			};
		});
		const { id, maxFrequency } = maxBy(frequencies, freq => freq.value);
		return id * maxFrequency.minute;
	}
};
