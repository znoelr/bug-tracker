const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Bug Tracker API',
    description: 'Bug Tracker Documentation',
  },
  host: `localhost:3000`,
};

const outputFile = './src/swagger.json';
const routes = ['./src/**/*router.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
