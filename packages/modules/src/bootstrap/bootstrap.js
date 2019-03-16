import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';

import mergeModules from './merge-modules';
import App from '../App';

/**
 * Create redux store based on the provided options
 *
 * @param 	{object} options		The redux configurationn
 * @returns	{object}				The redux store
 */
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
			applyMiddleware(...middlewares),
			...enhancers,
		),
	);
	if (storeCallback) {
		storeCallback(store);
	}
	return store;
}

/**
 * Bootstrap a React/redux App, based on a provided configuration
 *
 * @param {object} configuration		The app configuration
 */
export default function bootstrap(configuration) {
	const options = mergeModules(configuration);
	const store = bootstrapRedux(options);
	render(
		<App store={store} loading={options.AppLoader} RootComponent={configuration.rootComponent} />,
		document.getElementById(options.appId),
	);
}
