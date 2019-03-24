# @jso/react-modules

`@jso/react-modules` is a lightweight module management system.
It helps you to organize the code/files hierarchy, and simplify the bootstrap of your app.

It is based on:
* react as a component library
* redux as a state management library


## Table of content

1. [Installation](#installation): how to get the library.
2. [Bootstrap](#bootstrap): how to bootstrap your app.
3. [Modules](#modules): modules are the center of @jso/react-modules. Learn how to create your own modules to compose your apps.

## Installation

```
yarn install @jso/react-modules
```

## Bootstrap

```javascript
import { bootstrap } from '@jso/react-modules';
import { datasetModule } from '@myenterprise/dataset';
import App from './App.component';

bootstrap({
    appId: 'app',
    store: {
        enhancers: [],
        initialState: {},
        middlewares: [],
        reducer: {},
        storeCallback: (store) => {},
    },
    rootComponent: App,
    modules: [datasetModule]
});
```

`bootstrap()` accepts a configuration.

| Property | Description |
|---|---|
| appId | The id of the html element where to bootstrap the app. |
| store | The redux store configuration. See [redux documentation](https://redux.js.org/introduction/getting-started) for each sub property details. |
| store.enhancers | Redux enhancers. |
| store.initialState | Redux initial state. |
| store.middlewares | Redux middlewares. |
| store.reducer | Redux reducer. |
| store.storeCallback | Function that is executed after the store creation. The store is passed as first argument. |
| rootComponent | Your main app component. |
| modules | The list of additional modules. (See next section) |

## Modules

You pass your main module configuration to `bootstrap()`. All modules accept additional modules.

Modules are parts of configuration, following the `bootstrap()` api.
It allows you to split your app into multiple business modules.

Main module is merged with underlying modules to have a unique bootstrap configuration.

``` javascript
// my-addon module
const myAddonModule = {
    name: 'my-addon',
    store: {
        middlewares: [myAddonMiddleware],
        reducer: {
            'my-addon': myAddonReducer,
        },
        storeCallback: (store) => myAddonDoSomething(store),
    }
};


// the main app
import { myMiddleware, appReducer } from './app/config';
import App from './app/App';

bootstrap({
    appId: 'app',
    store: {
        middlewares: [myMiddleware],
        reducer: {
            app: appReducer,
        },
    },
    rootComponent: App,
    modules: [myAddonModule]
});
```

In this example, myAddonModule is merged with the configuration passed to `bootstrap()`
* middlewares will be `[myMiddleware, myAddonMiddleware]`
* reducer will contains `app` and `my-addon` reducer keys
* storeCallback will trigger only `myAddonDoSomething` as it's the only one.

Modules can be internal modules that are parts of your applications (see next section about custom modules), or external addon modules.
You can find some interesting addons :
* [Entities](../entities/README.md) : helps to manage entities with the fetch status and errors, or collections utility functions.
* [Saga](../saga/README.md) : add redux-saga with a hook/HOC to start/stop the saga followinng components mount/unmount.
* [Http](../http/README.md) : helps to manage http request, with the possibility to configure 1 global configuration, or 1 configuration per request.
* [Store utils](../store-utils/README.md) : a way to avoid writing reducers for very simple cases.

## Recommendations

Your React/Redux app should be splitted into business parts. It helps you to scale and organise your code.

Example of file hierarchy
```
<src-root>
    |_ components/
    |_ services/
        |_ modules.js               // gather all your app modules
        |_ datasets/
            |_ dataset.service.js   // service that exposes reducers, selectors and actions creators. All dataset redux intelligence is located here
            |_ index.js             // exposes services and '@jso/react-modules' configuration
        |_ user/
            |_ user.service.js
            |_ index.js
    |_ index.js                     // bootstrap your app, importing './services/modules'
```


A service exposes
* the service module configuration
* the action creators
* the selectors
* utility functions

Example of `dataset.service.js`
```javascript
const DATASET_REDUCER_KEY = 'datasets';
const SET_DATASETS = 'SET_DATASETS';

// reducer
function datasetReducer(state, action) {
    switch(action.type) {
        case SET_DATASETS:
            return { ...state, data: action.datasets }
        // other cases
    }
}
// boostrap module
export const reducer = {
    [DATASET_REDUCER_KEY]: datasetReducer,
};

// a selector
export function getDatasets(state) {
    return state[DATASET_REDUCER_KEY].data;
}

// an action creator
export function fetchDatasets() {
    return function fetchThunk(dispatch) {
        fetch('/datasets')
            .then(resp => resp.json())
            .then(datasets => {
                dispatch({
                    action: SET_DATASETS,
                    datasets,
                };
            });
    }
}
```

The service's `index.js` is the perfect place to gather your service reducers and service `bootstrap()` configuration.

Example of `index.js`
```javascript
import { reducer, getDatasets, fetchDatasets } from './dataset.service';

// @jso/react-modules module
export const datasetModule = {
    store: { reducer },
}

// service api
export default {
    actionCreators: { fetchDatasets, /* other dataset selectors */ },
    selectors: { getDatasets, /* other dataset selectors */ },
}
```
