import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import useSaga from './hook';
import withSaga from './hoc';

// @jso/react-modules module
const sagaMiddleware = createSagaMiddleware();
export const sagaModule = {
	store: {
		middlewares: [sagaMiddleware],
		storeCallback: () => sagaMiddleware.run(rootSaga),
	},
};

// HOC and hook
export default { withSaga, useSaga };
