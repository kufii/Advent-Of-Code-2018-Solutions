import input from './input.js';
import { nTimes } from '../../util.js';

const parseInput = () => input.split(' ').map(n => parseInt(n));

const getTree = nums => {
	let i = 0;
	const getTreeRecursive = () => {
		const [numChild, numMeta] = nums.slice(i, i + 2);
		const obj = {};
		i += 2;
		if (numChild > 0) {
			obj.children = [];
			nTimes(() => obj.children.push(getTreeRecursive()), numChild);
		}
		obj.metadata = nums.slice(i, i + numMeta);
		i+= numMeta;
		return obj;
	};
	return getTreeRecursive(nums);
};

const countMetadata = tree =>
	tree.metadata.reduce((count, n) => count + n, 0)
	+ (tree.children || []).reduce((count, child) => count + countMetadata(child), 0);

const countValue = tree =>
	tree.metadata.reduce(
		(count, n) => count + (
			tree.children
				? tree.children[n - 1] ? countValue(tree.children[n - 1]) : 0
				: n
		), 0
	);

export default {
	part1() {
		const input = parseInput();
		const tree = getTree(input);
		return countMetadata(tree);
	},
	part2() {
		const input = parseInput();
		const tree = getTree(input);
		return countValue(tree);
	}
};
