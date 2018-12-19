const obj = [
	'Arguments',
	'Function',
	'String',
	'Number',
	'Date',
	'RegExp'
].reduce((obj, name) => {
	obj[`is${name}`] = a => toString.call(a) === `[object ${name}]`;
	return obj;
}, {
	isGenerator: a => a instanceof (function*() { yield; }).constructor
});
const { isArguments, isFunction, isString, isNumber, isDate, isRegExp, isGenerator } = obj;

export default obj;
export { isArguments, isFunction, isString, isNumber, isDate, isRegExp, isGenerator };
