import input from './input.js';
import { makeArray, nTimes } from '../../util.js';

const parseInput = () => {
	const [_, numPlayers, lastMarble] = input.match(/(\d+)[^\d]*(\d+)/i);
	return { numPlayers: parseInt(numPlayers), lastMarble: parseInt(lastMarble) };
};

const run = (numPlayers, lastMarble) => {
	const scores = makeArray(numPlayers, null, 0);

	let current = { value: 0 };
	current.next = current.prev = current;
	const addAfter = value => {
		const next = current.next;
		current.next = { value, next, prev: current };
		current.next.next.prev = current.next;
	};
	const removePrev = () => {
		current.prev = current.prev.prev;
		current.prev.next = current;
	};

	for (let i = 1, player = 0; i <= lastMarble; i++, player = (player + 1) % numPlayers) {
		if (i % 23 === 0) {
			scores[player] += i;
			nTimes(() => current = current.prev, 7);
			scores[player] += current.value;
			current = current.next;
			removePrev();
		} else {
			current = current.next;
			addAfter(i);
			current = current.next;
		}
	}
	return Math.max(...scores);
};

export default {
	part1() {
		const { numPlayers, lastMarble } = parseInput();
		return run(numPlayers, lastMarble);
	},
	part2() {
		const { numPlayers, lastMarble } = parseInput();
		return run(numPlayers, lastMarble * 100);
	}
};
