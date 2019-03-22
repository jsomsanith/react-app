import { take, spawn, cancel } from 'redux-saga/effects';
import { SAGA_START, SAGA_STOP } from '../constants';

const startedSagas = {};

function* sagaStarter() {
	while (true) {
		const { id, saga } = yield take(SAGA_START);
		startedSagas[id] = yield spawn(saga);
	}
}

function* sagaStopper() {
	while (true) {
		const { id } = yield take(SAGA_STOP);
		yield cancel(startedSagas[id]);
		delete startedSagas[id];
	}
}

// main saga that will start all sagas from options
export default function* rootSaga() {
	yield spawn(sagaStarter);
	yield spawn(sagaStopper);
}
