# @jso/react-app-modules

`@jso/react-app-modules` is a lightweight lib that manages the bootstrap of your app. It contains 3 things
* react
* state management using redux
* additional modules management


## Table of content

1. [Installation](#installation): how to get the library.
2. [Bootstrap](#bootstrap): how to bootstrap your app.
3. [Modules](#modules): modules are the center of @jso/react-app-modules. Learn how to create your own modules to compose your apps.
4. [Services and custom modules](#services-and-custom-modules): learn how to write your services, composed with your custom modules, this represents a business part of your app.
5. [Conventions](#conventions): some code conventions.
6. [Recommanded optional libs](#recommanded-optional-libs): use those libs to manage router, immutability, ...


## Installation

```
yarn install @jso/react-app-modules
```

## Bootstrap

```javascript
import { bootstrap } from '@jso/react-app-modules';
import { datasetModule } from '@myenterprise/dataset';
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
    modules: [datasetModule]
});
```

| Property | Description |
|---|---|
| appId | The id of the html element where to bootstrap. |
| store | The redux store configuration. See [redux documentation](https://redux.js.org/introduction/getting-started) for each sub property details. |
| store.storeCallback | Function that is executed after the store creation. The store is passed as first argument. |
| rootComponent | Your main app component. |
| modules | The list of additional modules. (See next section) |

## Modules

Modules are part of configurations.

When you bootstrap your app, you pass your main app configuration. Modules are merged with this main configuration, that is handled by `bootstrap()`.

``` javascript
// my-addon module
const myAddonModule = {
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

Modules can be internal modules that are parts of your applications (see next section about custom modules), or external modules.
You can find some interesting external modules :
* [Entities](../entities/README.md) : helps to manage entities with the fetch status and errors.
* [Saga](../saga/README.md) : add redux-saga with a HOC to start/stop the saga depending on components mount/unmount.
* [Http](../http/README.md) : helps to manage http request, with the possibility to configure 1 global configuration, or 1 configuration per request.
* [Store utils](../store-utils/README.md) : a way to avoid writing reducers for very simple cases.

## Services and custom modules

A `@jso/react-app-modules` project follow the redux philosophy
* a store
* components that are not aware of the store
* react-redux connected components that `select` store parts, and `actions` functions

But it's important to keep the `store reducer`, `selector`, and `actions` in the same business entity in a same `module`, to make it
* easy to reason about
* easy to read and navigate within you folder architecture
* easy to maintain

Each of these modules exposes
* a `@jso/react-app-modules` module configuration. It's the right place to pass a reducer for example. This configuration must be passed to `bootstrap()` as module.
* a service

Services are the entities that hold the logic. They can have 2 natures
* redux service : holds the logic to communicate with redux (selectors, actions creators). They are used  in `react-redux > connect()` HOC (`mapStateToProps` and `mapDispatchToProps`).
* javascript service : holds computation logic. They are used in components or other services.

Example of redux service usage.
```javascript
import HomeService from '../services/home';

function mapStateToProps(state) {
    return { docked: HomeService.selectors.getMenuDocked(state) };
}

const mapDispatchToProps = {
    onToggleDock: HomeService.actions.toggleMenu,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Menu);
```

## Conventions

### Modules

The module exposes
* a named exported module configuration
* a default exported service

```javascript
// index.js
import HomeService from './Home.service';

// DO
export const myModule = {
    store: { reducer: { home: homeReducer } }
}

export default HomeService;


// DON'T
export default {
    store: { reducer: { home: homeReducer } }
}

export HomeService;
```

### Redux modules services

Redux modules would export
* a module configuration, containing reducers for example
* a service that contains `selectors` and `action creators`

The shape of the service should have a clear separation between the 2 types of entities
```javascript
// DO
const MyNonReduxService = {
    sum() {...},
    average() {...},
};

const MyReduxService = {
    selectors: {
        isOpen(store) {...},
        getTags(store) {...}
    },
    actions: {
        toggle() {...},
        setTags(tags) {...}
    }
}


// DON'T
const MyReduxService = {
    isOpen(store) {...},
    getTags(store) {...}
    toggle() {...},
    setTags(tags) {...}
}

```

## Recommanded optional libs

| Lib | Description |
|---|---|
| [react-router](https://github.com/ReactTraining/react-router) + [connected-react-router](https://github.com/supasate/connected-react-router) | Router lib |
| [redux-data-structures](https://redux-data-structures.js.org/) | Reducer generator that avoids lots of boilerplate |
| [immer](https://github.com/mweststrate/immer) | Immutability in reducers |
