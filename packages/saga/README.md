# @jso/react-modules-saga

This addon allows to attach a saga to a component lifecycle.
* exposes a hook and a HOC to attach a saga to a component
* starts the saga on component mount
* stops the saga on component unmount

**Why ?**
* it scales with the growth of sagas in your app, having only useful started sagas.
* automatically cancels running tasks when it is not relevant anymore, for example, on page change.

**What about sagas that must stay active ?**
* `Permanent sagas` are attached to root component which is never unmounted.

## Installation

```
yarn install @jso/react-modules-saga
```

## Bootstrap

With `@jso/react-modules`, just pass the saga module to bootstrap().

```javascript
import { bootstrap } from '@jso/react-modules';
import { sagaModule } from '@jso/react-modules-saga';
import App from './App.component';

bootstrap({
    // your app configuration

    modules: [sagaModule]
});
```

Without `@jso/react-modules`, you need to register yourself the starter/stopper in redux-saga

```javascript
import createSagaMiddleware from 'redux-saga';
import starterStopperSagas from '@jso/react-modules-saga/lib/sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    reducer,
    initialState,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(starterStopperSagas),
```

## useSaga hook

The `useSaga` hook allows you to attach a saga to a functional component

**Method**
```javascript
useSaga(dispatch, saga)
```

| Argument | Type | Description |
|---|---|---|
| dispatch | `function` | Redux store dispatch function. |
| saga | `generator` | The saga to start/stop during component mount/unmount event. |

**Example**

```javascript
import React from 'react';
import { useSaga } from '@jso/react-modules-saga';

import saga from './saga'; // datasets main saga

function Datasets({ dispatch, ...props }){
    useSaga(dispatch, saga);
    return <div/>;
}

export default connect()(Datasets);
```

## WithSaga HOC

The `withSaga` HOC allows you to attach a saga to a class component

**Method**
```javascript
withSaga(saga)(Component)
```

| Argument | Type | Description |
|---|---|---|
| saga | `generator` | The saga to start/stop during component mount/unmount event. |
| Component | `class` | The component which lifecycle controls the saga start/stop. |

**Example**

```javascript
import React from 'react';
import { withSaga } from '@jso/react-modules-saga';

import saga from './saga'; // datasets main saga

class Datasets extends React.Component {
    return () {
        return <div/>;
    }
}

export default withSaga(saga)(Datasets);
```
