// This file is the ........//

// - Imports the mongoose module from the mongoose library. 
// - Mongoose is a package on Node Package Manager.
import mongoose from 'mongoose';

// - Line 8 is the method provided by Mongoose to connect to a MongoDB database.
// - Argument passed is the connection string specifying the location of the MongoDB server and the name of the database to connect to.
// - 127.0.0.1:27017 is the IP address and port of the MongoDB server. IP is always that for local host and 27017 is the default port for MongoDB.
mongoose.connect('mongodb://127.0.0.1:27017/social_network_api_db');

// - mongoose.connection is the OBJECT that represents the connection to the MongoDB database we defined above.
export default mongoose.connection;