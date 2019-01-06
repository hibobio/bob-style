

<div style="text-align:center">
  <img src="https://images.hibob.com/icons/style-logo.png" alt="UI Framework Logo" width="250" height="250">
</div>


# Bob UI Framework
Library that contains all the **basic** bob UI elements. \
View it here [https://hibobio.github.io/bob-style/](https://hibobio.github.io/bob-style/)

## Installation and Usage
```sh
npm install bob-style
```

## Install the storybook project locally (If first time)
```sh
npm install
```

## Run the storybook project locally
```sh
npm run storybook
```

## Contribute Instructions
- Generate the new component source files
```sh
ng generate component newComponent --project=ui-framework
```
- Each component should have its own module and enum if there are any
- create index.ts file and export the relevant files (module, enums)
- Add to the peer dependencies collection of the library package.json any new dependencies
- Add also to the main package.json the new dependency
- Add the component stories file

## Run tests
```sh
npm run test
```










