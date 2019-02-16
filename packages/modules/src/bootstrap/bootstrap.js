import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import mergeModules from './modules';
import App from '../App';

function bootstrapRedux(options) {
	const {
		enhancers = [],
		initialState,
		middlewares = [],
		reducer = {},
		storeCallback,
	} = options.store;
	const store = createStore(
		combineReducers(reducer),
		initialState,
		compose(
			applyMiddleware(thunk, ...middlewares),
			...enhancers,
		),
	);
	if (storeCallback) {
		storeCallback(store);
	}
	return store;
}

export default function bootstrap(configuration) {
	const options = mergeModules(configuration);
	const store = bootstrapRedux(options);
	render(
		<App store={store} loading={options.AppLoader} RootComponent={configuration.rootComponent} />,
		document.getElementById(options.appId),
	);
}
