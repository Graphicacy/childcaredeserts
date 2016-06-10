# Interactive Build Template

### Build Setup
- clone this repo
- define the following as environment variables:
```
export RSA_KEY="[path/to/rsa/key]"
export STAGE_NAME="[username for servers]"
export STAGE_IP="[IP address of staging server]"
```
- *(optional)* Install all development dependencies globally on machine to keep the node_modules directory smaller: `npm install -g browserify uglify-js watchify minifier node-sass http-server livereload`, otherwise run `npm install` during Project Setup

### Project Setup
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
