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

function throwIfBothExists(obj1, obj2, name) {
	if (obj1 && obj2) {
		throw new Error(
			`Can't merge both config that both have ${name} attribute. Only one is accepted.`,
		);
	}
}

function getUnique(obj1, obj2, name) {
	throwIfBothExists(obj1, obj2, name);
	if (obj1) {
		return obj1;
	}
	return obj2;
}

function mergeArrays(firstArray, secondArray) {
	if (firstArray && secondArray) {
		return [].concat(firstArray).concat(secondArray);
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

function mergeAll(configs) {
	return configs.reduce(merge, {});
}

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
	const ids = [];
	modules.filter(mod => {
		if (!mod.id) {
			return true;
		}
		if (ids.includes(mod.id)) {
			return false;
		}

		ids.push(mod.id);
		return true;
	});

	return modules;
}

export default function mergeModules(configuration) {
	const configs = extractModules(configuration);
	return mergeAll(configs);
}
