import React from 'react';
import cases from 'jest-in-case';
import mergeModules from './merge-modules';

describe('Modules merge', () => {
	it('should remove sub modules definition', () => {
		// given
		const modules = [
			{ name: 'first', modules: [{ name: 'sub' }] },
			{ name: 'second', modules: [{ name: 'sub2' }] },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.modules).toBeUndefined();
	});

	it('should remove module names', () => {
		// given
		const modules = [{ name: 'first' }, { name: 'second' }];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.name).toBeUndefined();
	});

	cases(
		'should throw error',
		({ modules, attribute }) => {
			try {
				// when
				mergeModules({ modules });
			} catch (error) {
				// then
				expect(error.message).toBe(
					`@jso/react-modules doesn't accept multiple "${attribute}" attributes.` +
						`Please ensure your app doesn't use multiple modules that define "${attribute}" in their configuration`,
				);
			}
		},
		[
			{
				name: 'with multiple appId',
				modules: [{ name: 'first', appId: 'my-app' }, { name: 'second', appId: 'my-other-app' }],
				attribute: 'appId',
			},
			{
				name: 'with multiple appLoader',
				modules: [
					{ name: 'first', appLoader: <div>loading from 1</div> },
					{ name: 'second', appLoader: <div>loading from 2</div> },
				],
				attribute: 'appLoader',
			},
			{
				name: 'with multiple rootComponent',
				modules: [
					{ name: 'first', rootComponent: <div>from 1</div> },
					{ name: 'second', rootComponent: <div>from 2</div> },
				],
				attribute: 'rootComponent',
			},
		],
	);

	it('should merge store initialState', () => {
		const modules = [
			{ name: 'first', store: { initialState: { app: { value: 'from first module' } } } },
			{ name: 'second', store: { initialState: { lib: { val: 'from second module' } } } },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.initialState).toEqual({
			app: { value: 'from first module' },
			lib: { val: 'from second module' },
		});
	});

	it('should merge store enhancers', () => {
		// given
		const enhancer1 = jest.fn();
		const enhancer2 = jest.fn();
		const enhancer3 = jest.fn();
		const modules = [
			{ name: 'first', store: { enhancers: [enhancer1, enhancer2] } },
			{ name: 'second', store: { enhancers: [enhancer3] } },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.enhancers).toEqual([enhancer1, enhancer2, enhancer3]);
	});

	it('should merge store middlewares', () => {
		// given
		const mdlw1 = jest.fn();
		const mdlw2 = jest.fn();
		const mdlw3 = jest.fn();
		const modules = [
			{ name: 'first', store: { middlewares: [mdlw1, mdlw2] } },
			{ name: 'second', store: { middlewares: [mdlw3] } },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.middlewares).toEqual([mdlw1, mdlw2, mdlw3]);
	});

	it('should merge store reducer', () => {
		// given
		const reducer1 = jest.fn();
		const reducer2 = jest.fn();
		const reducer3 = jest.fn();
		const modules = [
			{ name: 'first', store: { reducer: { part1: reducer1, part2: reducer2 } } },
			{ name: 'second', store: { reducer: { part3: reducer3 } } },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.reducer).toEqual({
			part1: reducer1,
			part2: reducer2,
			part3: reducer3,
		});
	});

	it('should merge storeCallback', () => {
		// given
		const cb1 = jest.fn();
		const cb2 = jest.fn();
		const modules = [
			{ name: 'first', store: { storeCallback: cb1 } },
			{ name: 'second', store: { storeCallback: cb2 } },
		];

		const configuration = mergeModules({ modules });
		const store = { part1: { value: 2 } };

		expect(cb1).not.toBeCalled();
		expect(cb2).not.toBeCalled();

		// when
		configuration.store.storeCallback(store);

		// then
		expect(cb1).toBeCalledWith(store);
		expect(cb2).toBeCalledWith(store);
	});

	it('should merge nested modules', () => {
		// given
		const reducer1 = jest.fn();
		const reducer2 = jest.fn();
		const reducer3 = jest.fn();
		const mdlw1 = jest.fn();
		const mdlw2 = jest.fn();
		const mdlw3 = jest.fn();
		const modules = [
			{
				name: 'first',
				store: { middlewares: [mdlw1, mdlw2] },
				modules: [
					{
						name: 'nested',
						store: { reducer: { part1: reducer1, part2: reducer2 }, middlewares: [mdlw3] },
					},
				],
			},
			{ name: 'second', store: { reducer: { part3: reducer3 } } },
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.reducer).toEqual({
			part1: reducer1,
			part2: reducer2,
			part3: reducer3,
		});
		expect(configuration.store.middlewares).toEqual([mdlw1, mdlw2, mdlw3]);
	});

	it('should remove duplicates', () => {
		// given
		const reducer1 = jest.fn();
		const reducer2 = jest.fn();
		const reducer3 = jest.fn();
		const mdlw1 = jest.fn();
		const mdlw2 = jest.fn();
		const mdlw3 = jest.fn();
		const moduleThatWillBeAddedTwice = {
			name: 'nested',
			store: { reducer: { part1: reducer1, part2: reducer2 }, middlewares: [mdlw3] },
		};
		const modules = [
			{
				name: 'first',
				store: { middlewares: [mdlw1, mdlw2] },
				modules: [moduleThatWillBeAddedTwice],
			},
			moduleThatWillBeAddedTwice,
		];

		// when
		const configuration = mergeModules({ modules });

		// then
		expect(configuration.store.reducer).toEqual({
			part1: reducer1,
			part2: reducer2,
		});
		expect(configuration.store.middlewares).toEqual([mdlw1, mdlw2, mdlw3]);
	});
});
