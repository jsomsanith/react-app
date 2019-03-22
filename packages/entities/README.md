# @jso/react-modules-entities

This addon offers entities management.
* fetch status and errors
* store entities in redux store

Entities can have any data type: Object, Array, ...

## Installation

```
yarn install @jso/react-modules-entities
```

## Bootstrap

Just pass the entities module to `@jso/react-modules` bootstrap.

```javascript
import { bootstrap } from '@jso/react-modules';
import { entitiesModule } from '@jso/react-modules-entities';
import App from './App.component';

bootstrap({
    // your app configuration

    modules: [entitiesModule]
});
```

## Service selector

The service exposes a selector to get entity from redux store.

**Method**
```javascript
EntityService.selector.getEntity(state, entityId);
```

| Argument | Type | Description |
|---|---|---|
| state | `object` | The redux state. |
| entityId | `string` | The id, to which the entity is attached in the store. |

This method returns an entity with the following shape
```javascript
{
    data,
    isFetching,
    error,
}
```

| Property | Type | Description |
|---|---|---|
| data | `any` | The entity value. |
| isFetching | `boolean` | The id, to which the entity is attached in the store. |
| error | `object` | Error returned by fetch request. |

**Example**
```javascript
import React from 'react';
import { connect } from 'react-redux';
import EntitiesService from '@jso/react-modules-entities';

function DatasetsList(props) {
    const { isFetching, data, error } = this.props.datasets;

    // render your component
}

function mapStateToProps(state) {
    return { datasets: EntitiesService.selectors.getEntity(state, 'datasets') };
}

export default connect(mapStateToProps)(DatasetsList);
```

## Service actions

### Set entity

Set an entity in redux store.

**Method**
```javascript
EntityService.actions.setEntity(entityId, entity);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity will be attached in the store. |
| entity | `Promise` or `any` | The entity to create in store or a promise that resolves it. |

**Example**
```javascript
import React from 'react';
import { connect } from 'react-redux';
import EntitiesService from '@jso/react-modules-entities';

class DatasetsList extends React.Component {
    componentDidMount() {
        this.props.setEntity('datasets', HttpService.get('/api/datasets'));
    }

    render() {
        // render your component
    }
}

const mapDispatchToProps = {
    setEntity: EntitiesService.actions.setEntity,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatasetsList);

```

### AddToCollection

Add an element to a collection.

**Method**
```javascript
EntityService.actions.addToCollection(entityId, element);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| element | `Promise` or `any` | The element to add in the collection or a promise that resolves it. |

**Example**
```javascript
// tasks.service.js

import uuid from 'uuid';
import EntitiesService from '@jso/react-modules-entities';

function addTask(title, description) {
    const element = {
        id: uuid.v4(),
        title,
        description,
    };
    return EntitiesService.actions.addToCollection('tasks', element);
}

export default {
    addTask,
}
```

### InsertIntoCollection

Insert an element into a collection.

**Method**
```javascript
EntityService.actions.insertIntoCollection(entityId, index,element);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| index | `integer` | The index where to add the element. |
| element | `Promise` or `any` | The element to add in the collection or a promise that resolves it. |

**Example**
```javascript
// tasks.service.js

import uuid from 'uuid';
import EntitiesService from '@jso/react-modules-entities';

function addTask(title, description) {
    const element = {
        id: uuid.v4(),
        title,
        description,
    };
    return EntitiesService.actions.insertIntoCollection('tasks', element, 0); // insert as collection head
}

export default {
    addTask,
}
```

### RemoveFromCollectionByIndex

Remove an element from a collection, identified by the index.

**Method**
```javascript
EntityService.actions.removeFromCollectionByIndex(entityId, index, promise);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| index | `integer` | The index in the array to remove. |
| promise | `Promise` | `Optional`. A promise to wait before removing the element. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';
import HttpService from '@jso/http';

function removeTask(index) {
    return EntitiesService.actions.removeFromCollectionByIndex('tasks', index, HttpService.delete(index));
}

export default {
    removeTask,
}
```

### RemoveFromCollection

Remove an element from a collection.

**Method**
```javascript
EntityService.actions.removeFromCollection(entityId, element, promise);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| element | `any` | The element in the array to remove. |
| promise | `Promise` | `Optional`. A promise to wait before removing the element. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';
import HttpService from '@jso/http';

function removeTask(element) {
    return EntitiesService.actions.removeFromCollection('tasks', element, HttpService.delete(element));
}

export default {
    removeTask,
}
```

### ReplaceInCollectionByIndex

Replace an element in a collection, at the provided index.

**Method**
```javascript
EntityService.actions.replaceInCollectionByIndex(entityId, index, element);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| index | `integer` | The index in the array to replace. |
| element | `Promise` or `any` | The new element or a promise that resolves it. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';

function updateTask(index, newElement) {
    return EntitiesService.actions.replaceInCollectionByIndex('tasks', index, newElement);
}

export default {
    updateTask,
}
```

### ReplaceInCollection

Replace an element in a collection.

**Method**
```javascript
EntityService.actions.replaceInCollection(entityId, oldElement, newElement);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| oldElement | `any` | The element to replace. |
| newElement | `Promise` or `any` | The new element or a promise that resolves it. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';

function updateTask(oldElement, newElement) {
    return EntitiesService.actions.replaceICollection('tasks', oldElement, newElement);
}

export default {
    updateTask,
}
```
