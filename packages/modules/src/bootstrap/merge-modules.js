function getUnique(item1, item2, name) {
	if (item1 && item2) {
		throw new Error(
			`@jso/react-modules doesn't accept multiple "${name}" attributes.` +
				`Please ensure your app doesn't use multiple modules that define "${name}" in their configuration`,
		);
	}
	return item1 || item2;
}

function mergeObjects(obj1, obj2) {
	if (!obj2) {
		return obj1;
	}
	if (!obj1) {
		return obj2;
	}
	return Object.keys(obj2).reduce(
		(acc, key) => {
			if (obj2[key] === undefined) {
				throw new TypeError(`${key} value is undefined. You may have a bad import here`);
			}
			if (obj1[key] !== undefined && obj1[key] !== obj2[key]) {
				// eslint-disable-next-line no-console
				console.warn(`override detected ${key}`);
			}
			return {
				...acc,
				[key]: obj2[key],
			};
		},
		{ ...obj1 },
	);
}

function mergeFns(fn1, fn2) {
	if (!fn2) {
		return fn1;
	}
	if (!fn1) {
		return fn2;
	}
	return function mergedFn(...args) {
		fn1(...args);
		fn2(...args);
	};
}

function mergeArrays(firstArray, secondArray) {
	if (firstArray && secondArray) {
		const merged = [].concat(firstArray).concat(secondArray);
		return [...new Set(merged)];
	}
	if (secondArray) {
		return secondArray;
	}
	return firstArray;
}

const MERGE_FNS = {
	name: () => undefined,
	modules: () => undefined,
	appId: getUnique,
	appLoader: getUnique,
	rootComponent: getUnique,

	// eslint-disable-next-line no-use-before-define
	store: merge,
	enhancers: mergeArrays,
	initialState: mergeObjects,
	middlewares: mergeArrays,
	reducer: mergeObjects,
	storeCallback: mergeFns,
};

function merge(acc = {}, config) {
	return Object.keys(config).reduce((subacc, key) => {
		if (!MERGE_FNS[key]) {
			throw new Error(`${key} is not supported`);
		}
		return {
			...subacc,
			[key]: MERGE_FNS[key](acc[key], config[key], key),
		};
	}, acc);
}

/**
 * Merge an array of modules configuration to a single module
 *
 * @param 	{array} configs		The array of modules configuration
 * @returns {object}			The merged module configuration
 */
function mergeAll(configs) {
	return configs.reduce(merge, {});
}

/**
 * Extract nested modules and flatten them into ann array of modules
 *
 * @param 	{object} configuration		The main module configuration
 * @returns {array}						The flatten modules
 */
function extractModules(configuration) {
	// flatten modules
	let modules = [configuration];
	if (configuration.modules) {
		const subModules = configuration.modules
			.map(extractModules)
			.reduce((accu, mods) => accu.concat(mods), []);
		modules = modules.concat(subModules);
	}

	// remove duplicate modules
	const names = [];
	return modules.filter(({ name }) => {
		if (!name) {
			return true;
		}
		if (names.includes(name)) {
			return false;
		}

		names.push(name);
		return true;
	});
}

/**
 * Flatten and merge modules configuration
 *
 * @param 	{object} configuration		The main module configuration
 * @returns {object}					The merged configuration
 */
export default function mergeModules(configuration) {
	const configs = extractModules(configuration);
	return mergeAll(configs);
}
