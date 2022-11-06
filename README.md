## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## Available Scripts

### `npm run dev`

Run the server in development mode. The server is available on http://localhost:9999/

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.

## API

POST API is available at http://localhost:9999/submitResults. This end point will call the required API end points to get the text to search and subtexts and will post the results to the submit result endpoint and will return the result of the reckon post api endpoint

## TODOS

- Test cases
- Proper type checking/setting/handling
