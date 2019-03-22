import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import useSaga from './useSaga';
import { SAGA_START, SAGA_STOP } from '../constants';

function TestComponent({ dispatch, saga }) {
	useSaga(dispatch, saga);
	return null;
}

describe('useSaga', () => {
	it('should start saga at mount', () => {
		// given
		const dispatch = jest.fn();
		const saga = jest.fn();
		const mockedSagaId = 42; // this is set by uuid mock

		// when
		act(() => {
			mount(<TestComponent dispatch={dispatch} saga={saga} />);
		});

		// then
		expect(dispatch).toBeCalledWith({ type: SAGA_START, id: mockedSagaId, saga });
	});

	it('should stop saga at unmount', () => {
		// given
		const dispatch = jest.fn();
		const saga = jest.fn();
		const mockedSagaId = 42; // this is set by uuid mock

		act(() => {
			const wrapper = mount(<TestComponent dispatch={dispatch} saga={saga} />);
			expect(dispatch).toBeCalled();

			// when
			wrapper.unmount();
		});

		// then
		expect(dispatch.mock.calls.length).toBe(2);
		expect(dispatch.mock.calls[1]).toEqual([{ type: SAGA_STOP, id: mockedSagaId }]);
	});
});
