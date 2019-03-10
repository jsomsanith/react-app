import React from 'react';
import { shallow } from 'enzyme';
import App from './App.component';

describe('App component', () => {
	it('should render', () => {
		// when
		const wrapper = shallow(
			<App
				loading={<div id="loading">Please wait</div>}
				RootComponent={() => <div id="root">Content</div>}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});
});
