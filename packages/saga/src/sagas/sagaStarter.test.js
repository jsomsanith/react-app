/* eslint-disable no-empty-function */
import { take, spawn, cancel } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import rootSaga from './sagaStarter';
import { SAGA_START, SAGA_STOP } from '../constants';

describe('Saga starter', () => {
	it('should spawn starter and stopper', () => {
		// given
		const gen = rootSaga();

		// when
		const firstSpawn = gen.next().value;
		const SecondSpawn = gen.next().value;
		const doneAfterSecondSpawn = gen.next().done;

		// then
		expect(firstSpawn).toBeDefined();
		expect(SecondSpawn).toBeDefined();
		expect(doneAfterSecondSpawn).toBe(true);
	});

	it('should start saga', () => {
		// given
		const gen = rootSaga();
		const sagaStarter = gen.next().value.payload.fn;

		const sagaId = 42;
		function* sagaToStart() {}

		// when
		const starterGen = sagaStarter();
		const actualTake = starterGen.next().value;
		const actualSpawn = starterGen.next({ id: sagaId, saga: sagaToStart }).value;

		// then
		expect(actualTake).toEqual(take(SAGA_START));
		expect(actualSpawn).toEqual(spawn(sagaToStart));
	});

	it('should stop saga', () => {
		// given
		const gen = rootSaga();
		const sagaStarter = gen.next().value.payload.fn;
		const sagaStopper = gen.next().value.payload.fn;

		const sagaId = 42;
		function* sagaToStop() {}

		// given: start
		const mockedTask = createMockTask();
		const starterGen = sagaStarter();
		starterGen.next(); // take
		starterGen.next({ id: sagaId, saga: sagaToStop });
		starterGen.next(mockedTask);

		// when
		const stopperGen = sagaStopper();
		const actualTake = stopperGen.next().value;
		const actualSpawn = stopperGen.next({ id: sagaId }).value;

		// then
		expect(actualTake).toEqual(take(SAGA_STOP));
		expect(actualSpawn).toEqual(cancel(mockedTask));
	});
});
