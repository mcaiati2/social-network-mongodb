//  IMPORTS & VARIABLE DECLARATIONS //

// - Import express model from the express framework.
import express from 'express';

// - Imports database connection configuration. Lets my app establish a connection to the MongoDB database BEFORE starting the express server.
// - The connection the import is referencing is named mongoose.connection from server.ts file.
import connection from './config/connection.js';

// - Imports routes' configurations, where I defined routes for my API within my Express application.
import api_routes from './routes/api_routes.js';

// - Express function call creates an instance of an Express application. 'app' is a box we're storing things to.
// - The returned application object from the function call is now stored to a variable named 'app'.
// - (app is a common convention name, but this can be named anything you want! Even 'buffalo'!)
const app = express();

// - SET the port for the Express server to LISTEN ON. You listen to me now!!!!
// - First checks if there is a PORT environment variable defined. If it's not defined, it defaults to 3333.
const PORT = process.env.PORT || 3333;



// MIDDLEWARE //

// - App.use() middleware checks and processes requests before they reach the final destination. (final dest is the route handler).
// - app.use applies middleware, express.json is the middleware FUNCTION that parses JSON payloads in the request body.
// - Line 26 is middleware that checks if the incoming request has a JSON body and parses it to make it easier to read. If it doesn't have a JSON body, it just passes to next middleware.
app.use(express.json());

// - App.use() method is applying the 'api_routes' middleware to all routes that start with /api.
//  - Any request to a path that begins with /api will be handled by the api_routes Router.
app.use('/api', api_routes);



// SERVER SETUP //
//  - Wait for the database connection to be ready and then start the Express server when ready.

// - Connection says "waiting for the database connection to be ready".
// - .once(...) says "when the connection is open and ready, do this...".
connection.once('open', () =>  {

  // - app.listen(PORT...) says "start the express server to listen on this port for incoming requests."
  app.listen(PORT, () => {
    console.log('Express server started on', PORT);
  });
});