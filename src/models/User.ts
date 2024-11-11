// - This file defines a Mongoose schema and model for a User in a MongoDB database.
// - Models are primarily used to interact with the database.

// - Importing Mongoose because we will use Mongoose to interact with the database.
import mongoose from 'mongoose';

// - Importing bcrypt for password hashing.
import bcrypt from 'bcrypt';


// 'DESTRUCTURING ASSIGNMENT' OF VARIABLES FROM LIBRARIES //

// - Extracting two properties from the mongoose library (object) and creating variables for them. 

// - Schema is a constructor (capitalized).
// - model is a regular function (not capitalized).
const { Schema, model } = mongoose;

// - hash function creates a hashed version of a password.
// - compare function compares a plain text password with hashed password, sees if they match.
const { hash, compare } = bcrypt;


//  USER SCHEMA CREATION //

// - userSchema variable name can be anything.
// - Schema is the constrcutor function. Using it to create a NEW instance and storing it.
const userSchema = new Schema(
  {
    // Here, we are defining the OBJECT that will be passed to the Schema function. Ryan used ME as an object ):

    username: {
      type: String,
      unique: true,
      required: true,

      // - Trimmed attribute automatically removes leanding & trailing whitespace from a string before saving it to the database.
      trimmed: true,

    },
    email: {
      type: String,
      required: true,

      // - Uniue attribute (of the email field) ensures value of this field (email) must be unique across all DOCUMENTS in the COLLECTION. 
      unique: true,

      // - Match attribute says "the field value must match".
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],

    },
    password: {
      type: String,
      minLength: [6, 'Your password must be at least 6 characters in length'],

    },

    // - The 'thoughts' field is going to be an Array.
    // - Each property in this array is an object (we defined each element with {}).
    thoughts: [{

      // - Each element in the 'thoughts' array  is an ObjectId.
      // - ObjectId in MongoDB is a unique identifier for Documents.
      type: Schema.Types.ObjectId,

      // - The ObjectId in the 'thoughts' array reference documents in the Thought collection.
      // - Each ObjectId in the 'thoughts' array corresponds to a document in the Thought collection.
      ref: 'Thought'

      // - "The thoughts array is going to be an array of ObjectId values. Each ObjectId in this array references a DOCUMENT n the thoguhts COLLECTION."
    }],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    // - OPTION in Schema definition.
    // - toJson option allows you to specify a transformation function. 
    // - This function will be called when a document is converted to JSON.
    // - It will modify/transform the document (User) to remove sensitive information.
    // - This will ONLY apply when the document is converted to JSON.
    // - Used to add virtual properties

    //  - "Password and __v are going to be hashed and stored in the database. BUT when the document is converted to JSON, this transformation will remove those two fields for security."
    toJSON: {
      virtuals: true, // needs to be set to include virtual properties.
      // - first argument is the document being transformed (often _).
      // - user is the plain JS object representation of the document.
      transform(_, user) {
        // - Delete the user's password
        delete user.password;

        // - __v is an internal version key. Removed because it's irrelevant to the client.
        delete user.__v;

        // - Return the modified user object (will now exclude the password and __v fields).
        return user;
      }
    },
    toObject: {
      virtuals: true, // include virtual properties in the plain JS object output (when converting a mongoose document)
    }
  }
);

// MIDDLEWARE //



// - This code block is a Mongoose middleware function.
// - Ensures the user's password is hashed before being stored.

// - Call the pre() method on the userSchema we created.
userSchema.pre('save', async function (next) {
  const user: any = this;
  if (user.isNew) {
    user.password = await hash(user.password, 10)
  }
  next();
});
userSchema.methods.validatePassword = async function (formPassword: string) {
  return await compare(formPassword, this.password)
};

// VIRTUAL //
// - A 'virtual property' that is calculated and shown to the user but is not stored in the database. Used when converting a Mongoose document to JSON/JS.
//  - Get this user's length of friends' array and return the value as a virtual property named 'friendCount'.
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
})

const User = model('User', userSchema);

export default User; 