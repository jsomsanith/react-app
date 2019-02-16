import { loadEntity } from 'redux-entity';
import HttpService from '@jso/http';

export const ENTITIES_STORE_ROOT = 'entities';

export function getEntity(state, entityId) {
	return state[ENTITIES_STORE_ROOT][entityId];
}

export function fetchEntity(entityId, url) {
	return loadEntity(entityId, HttpService.get(url));
}
