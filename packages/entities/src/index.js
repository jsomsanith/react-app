import thunk from 'redux-thunk';
import { entities } from 'redux-entity';
import {
	ENTITIES_STORE_ROOT,
	getEntity,
	fetchEntity,
	insertIntoCollection,
	removeFromCollection,
	removeFromCollectionByIndex,
	replaceInCollection,
	replaceInCollectionByIndex,
	setEntity,
} from './entities';

// @jso/react-modules module
export const entitiesModule = {
	store: {
		middlewares: [thunk],
		reducer: {
			[ENTITIES_STORE_ROOT]: entities,
		},
	},
};

// Service
export default {
	actions: {
		fetchEntity,
		insertIntoCollection,
		removeFromCollection,
		removeFromCollectionByIndex,
		replaceInCollection,
		replaceInCollectionByIndex,
		setEntity,
	},
	selectors: { getEntity },
};
