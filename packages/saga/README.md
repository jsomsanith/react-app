# @jso/react-app-saga

This addon enables redux-saga.
It replaces redux-saga management with sagaRouter and avoids route configuration duplication.
* add redux-saga middleware
* expose a HOC that start/stop a saga based on the component mount/unmout

## Installation

```
yarn install @jso/react-app-saga
```

## Bootstrap

Just pass the saga module to `@jso/react-app-modules` bootstrap.

```javascript
import { bootstrap } from '@jso/react-app-modules';
import { sagaModule } from '@jso/react-app-saga';
import App from './App.component';

bootstrap({
    appId: 'app',
    store: {
        enhancers: [],
        initialState: {},
        middlewares: [],
        reducer: {},
        storeCallback: () => {},
    },
    rootComponent: App,
    modules: [sagaModule]
});
```

## WithSaga HOC

The `withSaga` HOC is the prefered way to start/stop a saga.
* it scales with the growth of sagas in your app, having only useful started sagas
* it allows cancellation when the component that uses it is unmounted

**Method**
```javascript
withSaga(saga)(Component)
```

| Argument | Type | Description |
|---|---|---|
| saga | `generator` | The saga to start/stop depending on the component mount event. |
| Component | `function`/`class` | The component which lifecycle controls the saga start/stop. |

**Example**

```javascript
import React from 'react';
import ProptTypes from 'prop-types';
import { withSaga } from '@jso/react-app-saga';

import saga from './saga'; // preparations main saga

function Preparations() {
    return <div/>;
}

// start/stop saga with mount/unmount
export default withSaga(saga)(Preparations);
```

Every app can attach sagas on the component they want to match a component lifecycle.

`Permanent sagas` are attached to root component which is never unmounted.
