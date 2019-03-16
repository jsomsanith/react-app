# react-app

1. [How to bootstrap your app](#bootstrap-your-app)
2. [Module system](#module-system)
3. [How to organise your code](#how-to-organise-your-code)
4. [Services and custom modules](#services-and-custom-modules)
5. [Code conventions](#code-conventions)
6. [Recommanded addons](#recommanded-addons)

## Services and custom modules

A `@jso/react-modules` project follow the redux philosophy
* a store
* components that are not aware of the store
* react-redux connected components that `select` store parts, and `actions` functions

But it's important to keep the store `reducer`, `selector`, and `actions` in the same business entity, in a same `module`, to make it
* easy to reason about
* easy to read and navigate within you folder architecture
* easy to maintain

Each of these modules exposes
* a `@jso/react-modules` module configuration. It's the right place to pass a reducer for example. This configuration must be passed to `bootstrap()` as module.
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

## Code conventions

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

## Recommanded addons

