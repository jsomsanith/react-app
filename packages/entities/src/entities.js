/* eslint-disable no-param-reassign */
import { loadEntity } from 'redux-entity';
import HttpService from '@jso/http';

export const ENTITIES_STORE_ROOT = '@jso/react-module-entities';

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
 * Action: fetch an entity, and add it in redux store
 *
 * @param 	{string} entityId		The entity id
 * @param 	{string} url			The url where to GET the entity
 * @param 	{Function} transform	A function to apply to fetch response before storing it
 * @returns {Function}				A thunk to dispatch
 */
export function fetchEntity(entityId, url, transform) {
	return loadEntity(
		entityId,
		HttpService.get(url).then(entity => {
			if (transform) {
				return transform(entity);
			}
			return entity;
		}),
	);
}

/**
 * Action: set entity in store
 *
 * @param 	{string} entityId		The entity id
 * @param 	{any} entity			The entity to set in store
 * @returns {Function}				A thunk to dispatch
 */
export function setEntity(entityId, entity) {
	return loadEntity(entityId, Promise.resolve(entity));
}

function generateCollectionThunk(entityId, modifier) {
	return (dispatch, getState) => {
		const actionPromise = new Promise((resolve, reject) => {
			const entity = getEntity(getState(), entityId);
			if (!Array.isArray(entity)) {
				reject(
					`@jso/react-modules-entities#insertIntoCollection to "${entityId}" failed: The entity is not an array.`,
				);
			}

			const modifiedEntity = entity.slice(0);
			modifier(modifiedEntity);
			resolve(modifiedEntity);
		});
		dispatch(loadEntity(entityId, actionPromise));
	};
}

/**
 * Action: insert an element into the collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} element			The element to insert
 * @param 	{number} index			If provided, it indicates where to insert the element.
 * 									Otherwise it's inserted at the end
 * @returns {Function}				The thunk to dispatch
 */
export function insertIntoCollection(entityId, element, index) {
	return generateCollectionThunk(entityId, entity => {
		if (index === undefined) {
			entity.push(element);
		} else {
			entity.splice(index, 0, element);
		}
	});
}

/**
 * Action: Remove the element in collection, at provided index
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{number} index			The index of the element to remove
 * @returns {Function}				The thunk to dispatch
 */
export function removeFromCollectionByIndex(entityId, index) {
	return generateCollectionThunk(entityId, entity => {
		entity.splice(index, 1);
	});
}

/**
 * Action: Remove an element from collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} element			The element to remove
 * @returns {Function}				The thunk to dispatch
 */
export function removeFromCollection(entityId, element) {
	return generateCollectionThunk(entityId, entity => {
		const index = entity.indexOf(element);
		entity.splice(index, 1);
	});
}

/**
 * Action: Replace an element in collection, at provided index
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{number} index			The old element index in collection
 * @param 	{any} newElement		The new element
 * @returns {Function}				The thunk to dispatch
 */
export function replaceInCollectionByIndex(entityId, index, newElement) {
	return generateCollectionThunk(entityId, entity => {
		entity[index] = newElement;
	});
}

/**
 * Action: Replace an element in collection
 *
 * @param 	{string} entityId		The collection entity id
 * @param 	{any} oldElement		The element to replace
 * @param 	{any} newElement		The new element
 * @returns {Function}				The thunk to dispatch
 */
export function replaceInCollection(entityId, oldElement, newElement) {
	return generateCollectionThunk(entityId, entity => {
		const index = entity.indexOf(oldElement);
		entity[index] = newElement;
	});
}
