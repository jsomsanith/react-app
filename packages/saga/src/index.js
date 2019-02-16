import createSagaMiddleware from 'redux-saga';
import withSaga from './withSaga';
import rootSaga from './sagaStarter';

// @jso/react-modules module
const sagaMiddleware = createSagaMiddleware();
export const sagaModule = {
	store: {
		middlewares: [sagaMiddleware],
		storeCallback: () => sagaMiddleware.run(rootSaga),
	},
};

// HOC
export default { withSaga };
