import mergeModules from './merge-modules';

describe('Modules merge', () => {
	it('should remove sub modules definition', () => {
		// given
		const modules = [
			{ name: 'myFirstModule', modules: [{ name: 'sub' }] },
			{ name: 'mSecondModule', modules: [{ name: 'sub2' }] },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.modules).toBeUndefined();
	});
});
