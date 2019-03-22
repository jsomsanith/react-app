import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import useSaga from './useSaga';
import { SAGA_START } from './constants';

function TestComponent({ dispatch, saga }) {
	useSaga(dispatch, saga);
	return null;
}

describe('useSaga', () => {
	it('should start saga', () => {
		// given
		const dispatch = jest.fn();
		const saga = jest.fn();

		// when
		act(() => {
			mount(<TestComponent dispatch={dispatch} saga={saga} />);
		});

		// then
		expect(dispatch).toBeCalledWith({ type: SAGA_START, id: 42, saga });
	});
});
