import { entities } from 'redux-entity';
import { ENTITIES_STORE_ROOT, fetchEntity, getEntity } from './entities';

// @jso/react-modules module
/* TODO this module depends on thunk
 it should add it in dependencies and module definition
 @jso/react-modules bootstrap should remove duplicates during module merge
 */
export const entitiesModule = {
	store: {
		reducer: {
			[ENTITIES_STORE_ROOT]: entities,
		},
	},
};

// Service
export default {
	actions: { fetchEntity },
	selectors: { getEntity },
};
