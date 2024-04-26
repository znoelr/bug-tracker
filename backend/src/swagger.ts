import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Bug Tracker API Documentation',
      version: '1.0.0',
      description: 'Documentation for Bug Tracker API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
        description: 'Development server',
      },
    ],
  },
  apis: ['src/**/api-docs.ts'], // Update with your file paths
};

const specs = swaggerJSDoc(options);

export default specs;
