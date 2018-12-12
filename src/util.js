const toIterator = (arr, loop=false) => ({
	*[Symbol.iterator]() {
		for (let i = 0; i < loop ? Infinity : arr.length; i++) {
			yield arr[i % arr.length];
		}
	}
});

const countOccurances = (str, toCount) => (str.length - str.replace(new RegExp(toCount, 'g'), '').length) / toCount.length;

const range = (start, stop) => {
	const result = [];
	if (isString(start)) {
		for (let i = start.charCodeAt(0); i <= stop.charCodeAt(0); i++) {
			result.push(String.fromCharCode(i));
		}
	} else {
		for (let i = start; i <= stop; i++) {
			result.push(i);
		}
	}
	return result;
};

const makeArray = (ySize, xSize=null, fill=null) => {
	const arr = [];
	for (let y = 0; y < ySize; y++) {
		if (xSize) {
			arr.push([]);
			for (let x = 0; x < xSize; x++) {
				arr[y].push(fill);
			}
		} else {
			arr.push(fill);
		}
	}
	return arr;
};

const isString = a => typeof a === 'string' || a instanceof String;

const isGenerator = a => a instanceof (function*() { yield; }).constructor;

const distinct = (value, index, self) => self.indexOf(value) === index;

const maxBy = cb => (a, b) => cb(b) > cb(a) ? b : a;

const minBy = cb => (a, b) => cb(b) < cb(a) ? b : a;

const sortBy = cb => (a, b) => isString(cb(a)) ? cb(a).localeCompare(cb(b)) : cb(a) - cb(b);

const sortByDesc = cb => (a, b) => isString(cb(a)) ? cb(b).localeCompare(cb(a)) : cb(b) - cb(a);

const groupBy = (cbKey, cbValue) => (a, b) => {
	const key = cbKey(b);
	const value = cbValue ? cbValue(b) : b;
	if (!a[key]) a[key] = [];
	a[key].push(value);
	return a;
};

const toDict = (cbKey, cbValue) => (a, b) => {
	const key = cbKey(b);
	const value = cbValue ? cbValue(b) : b;
	a[key] = value;
	return a;
};

const nTimes = (cb, n) => {
	for (let i = 0; i < n; i++) {
		cb(i);
	}
};

class SummedAreaTable {
	constructor(array) {
		this.sums = makeArray(array.length + 1, array[0].length + 1, 0);
		for (let y = 1; y < this.sums.length; y++) {
			for (let x = 1; x < this.sums[y].length; x++) {
				this.sums[y][x] = array[y - 1][x - 1] + this.sums[y - 1][x] + this.sums[y][x - 1] - this.sums[y - 1][x - 1];
			}
		}
	}
	get width() {
		return this.sums[0].length;
	}
	get height() {
		return this.sums.length;
	}
	calculateArea(x, y, width, height) {
		const [bx, by] = [x + width - 1, y + height - 1];
		return this.sums[by][bx] - this.sums[by - height][bx] - this.sums[by][bx - width] + this.sums[by - height][bx - width];
	}
}

export { toIterator, countOccurances, range, makeArray, isString, isGenerator, distinct, maxBy, minBy, sortBy, sortByDesc, groupBy, toDict, nTimes, SummedAreaTable };
