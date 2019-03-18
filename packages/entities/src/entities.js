/* eslint-disable no-param-reassign */
import { loadEntity } from 'redux-entity';

export const ENTITIES_STORE_ROOT = '@jso/entities';

/**
 * Selector: get the entity from redux store
 *
 * @param 	{object} state		The redux state
 * @param 	{string} entityId	The entity id
 * @returns {any}				The entity definition (isFetching, data, error)
 */
export function getEntity(state, entityId) {
	return state[ENTITIES_STORE_ROOT][entityId];
}

/**
 * Action: set entity in store
 *
 * @param 	{string} entityId		The entity id
 * @param 	{any} entity			The entity (or a Promise resolving it) to set in store
 * @returns {Function}				A thunk to dispatch
 */
export function setEntity(entityId, entity) {
	return loadEntity(entityId, Promise.resolve(entity));
}

function generateCollectionThunk(entityId, promise, modifier) {
	return (dispatch, getState) => {
		const actionPromise = promise.then(promiseResult => {
			const entity = getEntity(getState(), entityId);
			if (!Array.isArray(entity)) {
				throw new Error(
					`@jso/react-modules-entities#insertIntoCollection to "${entityId}" failed: The entity is not an array.`,
				);
			}

			const modifiedEntity = entity.slice(0);
			modifier(modifiedEntity, promiseResult);
			return modifiedEntity;
		});
		dispatch(loadEntity(entityId, actionPromise));
	};
}

/**
 * Action: add an element to the collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} element			The element to insert (or a Promise resolving it)
 * @returns {Function}				The thunk to dispatch
 */
export function addToCollection(entityId, element) {
	return generateCollectionThunk(entityId, Promise.resolve(element), (entity, resolvedElement) => {
		entity.push(resolvedElement);
	});
}

/**
 * Action: insert an element into the collection at a defined position
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{number} index			The index where to insert the element.
 * @param 	{any} element			The element to insert (or a Promise resolving it)
 * @returns {Function}				The thunk to dispatch
 */
export function insertIntoCollection(entityId, index, element) {
	return generateCollectionThunk(entityId, Promise.resolve(element), (entity, resolvedElement) => {
		entity.splice(index, 0, resolvedElement);
	});
}

/**
 * Action: Remove the element in collection, at provided index
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{number} index			The index of the element to remove
 * @param 	{Promise} promise		A promise to wait before performing the removal in store.
 * 									It can be a DELETE request for example.
 * @returns {Function}				The thunk to dispatch
 */
export function removeFromCollectionByIndex(entityId, index, promise) {
	return generateCollectionThunk(entityId, Promise.resolve(promise), entity => {
		entity.splice(index, 1);
	});
}

/**
 * Action: Remove an element from collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} element			The element to remove
 * @param 	{Promise} promise		A promise to wait before performing the removal in store.
 * 									It can be a DELETE request for example.
 * @returns {Function}				The thunk to dispatch
 */
export function removeFromCollection(entityId, element, promise) {
	return generateCollectionThunk(entityId, Promise.resolve(promise), entity => {
		const index = entity.indexOf(element);
		entity.splice(index, 1);
	});
}

/**
 * Action: Replace an element in collection, at provided index
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{number} index			The old element index in collection
 * @param 	{any} newElement		The new element (or a Promise resolving it)
 * @returns {Function}				The thunk to dispatch
 */
export function replaceInCollectionByIndex(entityId, index, newElement) {
	return generateCollectionThunk(
		entityId,
		Promise.resolve(newElement),
		(entity, resolvedNewElement) => {
			entity[index] = resolvedNewElement;
		},
	);
}

/**
 * Action: Replace an element in collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} oldElement		The element to replace
 * @param 	{any} newElement		The new element (or a Promise resolving it)
 * @returns {Function}				The thunk to dispatch
 */
export function replaceInCollection(entityId, oldElement, newElement) {
	return generateCollectionThunk(
		entityId,
		Promise.resolve(newElement),
		(entity, resolvedNewElement) => {
			const index = entity.indexOf(oldElement);
			entity[index] = resolvedNewElement;
		},
	);
}
