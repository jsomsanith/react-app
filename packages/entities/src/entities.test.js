import { getEntity } from './entities';

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
		it('should ', () => {
			// given
			// when
			// then
		});

		it('should ', () => {
			// given
			// when
			// then
		});
	});
});
