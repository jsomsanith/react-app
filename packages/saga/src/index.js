import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagaStarter';
import useSaga from './useSaga';
import withSaga from './withSaga';

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
