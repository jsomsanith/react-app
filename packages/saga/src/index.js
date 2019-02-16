import createSagaMiddleware from 'redux-saga';
import withSaga from './withSaga';
import rootSaga from './sagaStarter';

// @talend/app module
const sagaMiddleware = createSagaMiddleware();
export const sagaModule = {
	store: {
		middlewares: [sagaMiddleware],
		storeCallback: () => sagaMiddleware.run(rootSaga),
	},
};

// HOC
export default { withSaga };
