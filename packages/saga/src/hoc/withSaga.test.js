/* eslint-disable no-empty-function */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import withSaga from './withSaga';
import { SAGA_START, SAGA_STOP } from '../constants';

const mockedSagaId = 42; // this is set by uuid mock
const sagaToStart = function* sagaToStart() {};
const TestComponentWithSaga = withSaga(() => <div />, sagaToStart);

describe('withSaga', () => {
	it('should start saga at mount', () => {
		// given
		const store = {
			getState: () => {},
			subscribe: () => {},
			dispatch: jest.fn(),
		};

		// when
		act(() => {
			mount(
				<Provider store={store}>
					<TestComponentWithSaga />
				</Provider>,
			);
		});

		// then
		expect(store.dispatch).toBeCalledWith({
			id: mockedSagaId,
			saga: sagaToStart,
			type: SAGA_START,
		});
	});

	it('should start saga at mount', () => {
		// given
		const store = {
			getState: () => {},
			subscribe: () => {},
			dispatch: jest.fn(),
		};

		act(() => {
			const wrapper = mount(
				<Provider store={store}>
					<TestComponentWithSaga />
				</Provider>,
			);
			expect(store.dispatch).toBeCalled();

			// when
			wrapper.unmount();
		});

		// then
		expect(store.dispatch.mock.calls.length).toBe(2);
		expect(store.dispatch.mock.calls[1]).toEqual([{ type: SAGA_STOP, id: mockedSagaId }]);
	});
});
