# Rear CRA Template

Opinionated [create-react-app](https://github.com/facebookincubator/create-react-app) template bundled with 
[react-redux](https://github.com/reactjs/react-redux) and 
[react-router](https://github.com/ReactTraining/react-router).

## Table of contents

- [Installation](#installation)
  - [CRA Template](#cra-template)
  - [Create Rear App](#create-rear-app)
  - [Git Repository](#git-repository)
  - [Configuring your environments](#configuring-your-environments)
- [Structure](#structure)
  - [Root Directory](#root-directory)
  - [Containers](#containers)
  - [Components](#components)
  - [Actions and Reducers](#actions-and-reducers)
  - [Core](#core)
- [Custom Scripts](#custom-scripts)
  - [Creating a new component](#creating-a-new-component)
  - [Creating a new container](#creating-a-new-container)
  - [Creating actions](#creating-actions)
- [Using SASS](#using-sass)
- [API Middleware](#api-middleware)

## Installation

### CRA Template

To install this template as a create-react-app template type:

    npx create-react-app <your_app> --template rear

After the installation process has completed, go into your newly created app
directory and run the setup script.

    cd <your_app>
    yarn setup

### Create Rear App

A simpler way to install this template is by using the 
[create-rear-app](https://github.com/erremauro/create-rear-app)

    npx create-rear-app <your_app>

### Git Repository

You can also install this template directly from git by typing:

    git clone https://github.com/erremauro/react-template <PROJECT_DIR>
    cd <PROJECT_DIR> && git init && yarn install


### Configuring your environments

You can configure your production and development URLs inside: 

* `./src/core/site-url/site-url.js`
* `./src/core/site-url/api-url.js`

## Structure

This template differs between components, containers, actions and reducers.

    src/
    ├── actions
    ├── components
    ├── containers
    ├── core
    └── reducers

### Root Directory

A link to the `src` directory is created during the `postinstall` procedure. You
can import files from the root directory using `@` (e.g. `@/components` to 
import files from `./src/components`).

### Components

Components are reusable react components stored in `./src/components`.

### Containers

Containers are Higher Order components that render application views and 
manage application state via redux providers. They are stored in 
`./src/containers`.

### Actions and Reducers

Reducers stored in `./src/reducers` keeps track of application states changes
triggered by actions stored in `./src/actions` (usually connected as container's
props via redux providers).

### Core

Common libraries are stored in `./src/core`.

## Custom Scripts

The template has a set of scripts to help you bootstrap containers, components
and actions. All script can be found in the `./scripts` directory.

### Creating a new component

Create a new React Component in the `./src/components` directory.

    yarn create-component <NAME>

### Creating a new container

Create a new React Component in the `./src/containers` directory that is 
connected to a redux action provider.

    yarn create-container <NAME>

### Creating actions

Create a new set of actions and a reducer in `./src/actions` and `./reducers`

    yarn create-actions <NAME>

Once the reducer has been created it must be manually added to 
`./src/reducers/index.js` reducers list.

## Using SASS

You can configure your project for using [Sass](https://sass-lang.com) or CSS
stylesheet format in `package.json`'s `rearConfig` section by changing the
`sass` property.

```json
{
  "rearConfig": {
    "sass": true
  }
}
```

You can then run `yarn setup` to reconfigure your project. 

**Note**: During the configuration process the stylesheets are just renamed. No
changes to the content is made. Bear in mind that if you choose to downgrade
to CSS from Sass, you'll need to update the content that uses Sass specifc
syntax. 

## API Middleware

This template has a redux middleware to make API calls already setup for you. 
To make an api call, return an `API_CALL` object from an action.

```javascript
// src/actions/FooBar/FooBarActions.js

import { FooBarActionType as ActionType } from './FooBarActionType';

function myAction(id, model) {
  return({
    API_CALL: {
      types: [
        ActionType.MY_ACTION_REQUEST,
        ActionType.MY_ACTION_SUCCESS,
        ActionType.MY_ACTION_FAILURE
      ],
      endpoint: `myendpoint/${id}`,
      params: model
    }
  })
}

export const myAction = (id, model) => dispatch => dispatch(myAction(id, model));
```

Note that the `endpoint` parameter must be relative to the api url specified in
`./src/core/site-url/api-url.js` or a full URL 
(i.e. https://api.site.com/endpoint.json).

```javascript
type API_CALL = {
  types: Array<string>,
  endpoint: string,
  params?: object,
  payload?: object,
  method?: string,
  dataType?: string
}
```

Use `params` to make `GET` requests passing query parameters and `payload` to 
pass data via `POST` requests. If you need to send a payload using other 
methods, explicity specify the method name (i.e. `method: 'PUT'`, to make `PUT` 
requests).

API responses can be then processed to update reducer's states:

```javascript
// src/reducers/myReducer.js

function updateState(newState) {
  currentState = Object.assign(currentState, newState);
  return currentState;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionType.MY_ACTION_SUCCESS:
      return updateState(action.response);
    default:
      return state;
  }
}
```

Or error handled in containers:

```javascript
// src/containers/MyContainer/MyContainer.js

class MyContainer extends Component {
  loadData() {
    this.props.myAction().then(action => {
      if (action.type === ActionType.MY_ACTION_FAILURE) {
        // handle api response error
      }
    });
  }
}
```
