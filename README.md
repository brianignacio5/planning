# planning-app

This project is an attempt to make a Trello-like task management app.

Using Vue, Vuex, MongoDB (probably) and Express for backend.

To-do

1. Add task modal window to do CRUD.
2. Improve task ordering
3. Add user OAuth
4. Add comments system for tasks modal window

Task modal window should include

1. Task title, description input and user dropdown.
2. Comments with date.


API Definition
/:project
GET boards for a given project.
POST add new project.
DELETE remove project

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
