# Interactive Build Template

## Getting Started
A dead simple template for building interactives. All build tasks are handled with npm scripts inside `package.json`. Source files are kept in src/ while build files are kept in public/. To keep things tidy and modular, this template is designed with Browserify and Sass in mind and has a directory structure meant to reinforce modular code.

### Build Setup
- clone this repo
- define the following as environment variables:
```
export RSA_KEY="[path/to/rsa/key]"
export STAGE_NAME="[username for servers]"
export STAGE_IP="[IP address of staging server]"
```
- *(optional)* Install all development dependencies globally on machine to keep the node_modules directory smaller: `npm install -g browserify uglify-js watchify minifier node-sass http-server livereload`, otherwise run `npm install` during Project Setup
- Set up bash build script for convenience. Open `buildive` file and change .git locations to cloned directory's location. Then run `cp buildive /usr/local/bin/`

### Project Setup
- run `buildive <interactive name>`
- Open `package.json` and change name, description, keyword, staging directory
- Open `public/index.html` and change meta data
- run `npm install` if you did not install development dependencies globally

### Develop
- Install project dependencies (e.g. `npm install d3 react underscore --save`)
- Start local server / livereload : `npm start`
- Use CommonJS syntax to import scripts into `src/js/index.js`
  - `require( './my-class.js' )`
- @import .scss files into `src/sass/index.scss`

### Build:
  - `npm run build`
  - Open `public/index.html` and change app.css to app.min.css and app.js to app.min.js
  - push to staging server: `npm run push-stage`.

## Interactive styling

- Interactive markup should go inside `<main></main>` which has a max 880px width to fit CAP's wide-format wordpress post
- If you need a full-width header, use `<header></header>`.
- by default, direct children of header will be floated
- add a logo with `<div class="logo"></div>`
- a direct child of main or header with a `wrap` class will get 10px left/right padding and remove any floats.
- for titles, use `<h1 class="hed"></h1>` and `<h2 class="dek"></h2>`
- if you don't want to use default CAP styles, remove `modules/core/style` import from index.scss

### Sass helpers

|  name | use |
|---|---|
| @function color( $CAP-color, $opacity*:optional*)  | Use CAP palettes for red, blue, brown, yellow, orange and gray in dark, medium, light, ultra-light (e.g.: `box-shadow: 0 0 1px color( ultra-light-blue, 0.75 );`)|
| @mixin vertical-center  |  vertically center element (inside relative positioned parent) |
|  @mixin horizontal-center | horizontally center element (inside relative positioned parent)  |
| @mixin center | center elment horizontally and vertically (inside relative positioned parent) |
| @mixin bottom-box-border($thickness*:integer*, $color*:optional*) | add border with changing box-sizing |  
| @mixin top-box-border($thickness*:integer*, $color*:optional*) | add border with changing box-sizing |
| @mixin transition($property,$duration, $transition) | convenience mixin for cross-browser support |
| @mixin rotate($deg) | convenience mixin for cross-browser support |
| @mixin animation-optimization | add translateZ(0) to elements for faster GPU rendering on  mobile devices |
| @mixin light-box-shadow($border-color*:optional*) | a simple, subtle box shadow |
