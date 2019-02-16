import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

export default function App({ loading, RootComponent, store }) {
	return (
		<Provider store={store}>
			<Suspense fallback={loading}>
				<RootComponent />
			</Suspense>
		</Provider>
	);
}
App.propTypes = {
	loading: PropTypes.node,
	RootComponent: PropTypes.func,
	store: PropTypes.object,
};
