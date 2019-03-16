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

Modules are parts of configuration.

When you bootstrap your app, you pass your main app configuration. Modules are merged with this main configuration.

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
* storeCallback will trigger only myAddonModule storeCallback as it's the only one.

Modules can be internal modules that are parts of your applications (see next section about custom modules), or external addon modules.
You can find some interesting addons :
* [Entities](../entities/README.md) : helps to manage entities with the fetch status and errors.
* [Saga](../saga/README.md) : add redux-saga with a HOC to start/stop the saga depending on components mount/unmount.
* [Http](../http/README.md) : helps to manage http request, with the possibility to configure 1 global configuration, or 1 configuration per request.
* [Store utils](../store-utils/README.md) : a way to avoid writing reducers for very simple cases.
