import cases from 'jest-in-case';
import {
	ENTITIES_STORE_ROOT,
	getEntity,
	setEntity,
	addToCollection,
	insertIntoCollection,
	removeFromCollectionByIndex,
	removeFromCollection,
	replaceInCollectionByIndex,
	replaceInCollection,
} from './entities';

jest.mock('redux-entity', () => ({ loadEntity: (...args) => args }));

describe('Entities', () => {
	describe('selectors', () => {
		it('should get the entity', () => {
			// given
			const entityId = 'datasets';
			const datasetEntity = {
				isFetching: false,
				error: undefined,
				data: [],
			};
			const state = {
				'@jso/entities': {
					datasets: datasetEntity,
					datastores: { isFetching: true, data: undefined, error: undefined },
				},
			};

			// when
			const entity = getEntity(state, entityId);

			// then
			expect(entity).toBe(datasetEntity);
		});
	});

	describe('actions', () => {
		describe('setEntity', () => {
			it('should set entity', done => {
				// given
				const entityId = 'my-entity';
				const entity = { lol: 'mdr' };

				// when
				const mockResult = setEntity(entityId, entity);

				// then
				expect(mockResult[0]).toBe(entityId);
				mockResult[1].then(resolvedEntity => {
					expect(resolvedEntity).toBe(entity);
					done();
				});
			});

			it('should set entity from promise', done => {
				// given
				const entityId = 'my-entity';
				const entity = { lol: 'mdr' };
				const entityPromise = Promise.resolve(entity);

				// when
				const mockResult = setEntity(entityId, entityPromise);

				// then
				expect(mockResult[0]).toBe(entityId);
				mockResult[1].then(resolvedEntity => {
					expect(resolvedEntity).toBe(entity);
					done();
				});
			});
		});

		cases(
			'collections',
			(opts, done) => {
				// given
				const entityId = 'my-entity';
				const entity = ['lol', 'mdr', 'ptdr'];
				const dispatch = jest.fn();
				const getState = () => ({ [ENTITIES_STORE_ROOT]: { [entityId]: entity } });
				const { execute, expectedEntity } = opts;

				// when
				const thunk = execute(entityId);
				thunk(dispatch, getState);
				expect(dispatch).toBeCalled();
				const mockResult = dispatch.mock.calls[0][0];

				// then
				expect(mockResult[0]).toBe(entityId);
				mockResult[1].then(resolvedEntity => {
					expect(resolvedEntity).toEqual(expectedEntity);
					done();
				});
			},
			[
				{
					name: '#addToCollection should add entity',
					execute: entityId => addToCollection(entityId, 'rire'),
					expectedEntity: ['lol', 'mdr', 'ptdr', 'rire'],
				},
				{
					name: '#addToCollection should add entity from promise',
					execute: entityId => addToCollection(entityId, Promise.resolve('rire')),
					expectedEntity: ['lol', 'mdr', 'ptdr', 'rire'],
				},
				{
					name: '#insertIntoCollection should insert entity',
					execute: entityId => insertIntoCollection(entityId, 1, 'rire'),
					expectedEntity: ['lol', 'rire', 'mdr', 'ptdr'],
				},
				{
					name: '#addToCollection should insert entity from promise',
					execute: entityId => insertIntoCollection(entityId, 1, Promise.resolve('rire')),
					expectedEntity: ['lol', 'rire', 'mdr', 'ptdr'],
				},
				{
					name: '#removeFromCollectionByIndex should remove element at provided index',
					execute: entityId => removeFromCollectionByIndex(entityId, 1),
					expectedEntity: ['lol', 'ptdr'],
				},
				{
					name: '#removeFromCollectionByIndex should wait promise resolution before removal',
					execute: entityId => removeFromCollectionByIndex(entityId, 1, Promise.resolve()),
					expectedEntity: ['lol', 'ptdr'],
				},
				{
					name: '#removeFromCollection should remove element',
					execute: entityId => removeFromCollection(entityId, 'mdr'),
					expectedEntity: ['lol', 'ptdr'],
				},
				{
					name: '#removeFromCollection should wait promise resolution before removal',
					execute: entityId => removeFromCollection(entityId, 'mdr', Promise.resolve()),
					expectedEntity: ['lol', 'ptdr'],
				},
				{
					name: '#replaceInCollectionByIndex should replace element at provided index',
					execute: entityId => replaceInCollectionByIndex(entityId, 1, 'rire'),
					expectedEntity: ['lol', 'rire', 'ptdr'],
				},
				{
					name: '#replaceInCollectionByIndex should replace element with promise resolution',
					execute: entityId => replaceInCollectionByIndex(entityId, 1, Promise.resolve('rire')),
					expectedEntity: ['lol', 'rire', 'ptdr'],
				},
				{
					name: '#replaceInCollection should replace element',
					execute: entityId => replaceInCollection(entityId, 'mdr', 'rire'),
					expectedEntity: ['lol', 'rire', 'ptdr'],
				},
				{
					name: '#replaceInCollection should replace element with promise resolution',
					execute: entityId => replaceInCollection(entityId, 'mdr', Promise.resolve('rire')),
					expectedEntity: ['lol', 'rire', 'ptdr'],
				},
			],
		);

		it('should throw an error if collection action is not on collection', done => {
			// given
			const entityId = 'my-entity';
			const entity = 'not a collection';
			const dispatch = jest.fn();
			const getState = () => ({ [ENTITIES_STORE_ROOT]: { [entityId]: entity } });

			// when
			const thunk = addToCollection(entityId, 'whatever');
			thunk(dispatch, getState);
			expect(dispatch).toBeCalled();
			const mockResult = dispatch.mock.calls[0][0];

			// then
			expect(mockResult[0]).toBe(entityId);
			mockResult[1].catch(error => {
				expect(error.message).toBe(
					'@jso/react-modules-entities#insertIntoCollection to "my-entity" failed: The entity is not an array.',
				);
				done();
			});
		});
	});
});
