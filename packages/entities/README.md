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

### Fetch

Perform a fetch request and put it in redux store, managing the request status.

**Method**
```javascript
EntityService.actions.fetchEntity(entityId, url);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity will be attached in the store. |
| url | `string` | The url to GET the entity. It uses `@jso/react-modules-http` to perform the fetch. To configure it, please refers to the [http addon documentation](../http/README.md). |

**Example**
```javascript
import React from 'react';
import { connect } from 'react-redux';
import EntitiesService from '@jso/react-modules-entities';

class DatasetsList extends React.Component {
    componentDidMount() {
        this.props.fetchDataset('datasets', '/datasets.json');
    }

    render() {
        // render your component
    }
}

const mapDispatchToProps = {
    fetchDataset: EntitiesService.actions.fetchEntity,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatasetsList);

```

### AddToCollection

Insert an element in a collection.

**Method**
```javascript
EntityService.actions.addToCollection(entityId, element, index);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| element | `any` | The element to add in the collection. |
| index | `integer` | The index where to add the element. If `undefined`, it will be added at the end of the collection. |

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
    return EntitiesService.actions.addToCollection('tasks', element, 0); // add as collection head
}

export default {
    addTask,
}
```

### RemoveFromCollectionByIndex

Remove an element from a collection, identified by the index.

**Method**
```javascript
EntityService.actions.removeFromCollectionByIndex(entityId, index);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| index | `integer` | The index in the array to remove. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';

function removeTask(index) {
    return EntitiesService.actions.removeFromCollectionByIndex('tasks', index);
}

export default {
    removeTask,
}
```

### RemoveFromCollection

Remove an element from a collection.

**Method**
```javascript
EntityService.actions.removeFromCollection(entityId, element);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| element | `any` | The element in the array to remove. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';

function removeTask(element) {
    return EntitiesService.actions.removeFromCollection('tasks', element);
}

export default {
    removeTask,
}
```

### ReplaceInCollectionByIndex

Replace an element in a collection, at the provided index.

**Method**
```javascript
EntityService.actions.replaceInCollectionById(entityId, index, element);
```

| Argument | Type | Description |
|---|---|---|
| entityId | `string` | The id, to which the entity is attached in the store. |
| index | `integer` | The index in the array to replace. |
| element | `any` | The new element. |

**Example**
```javascript
// tasks.service.js

import EntitiesService from '@jso/react-modules-entities';

function updateTask(index, element) {
    return EntitiesService.actions.replaceInCollectionById('tasks', index, element);
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
| newElement | `any` | The new element. |

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
