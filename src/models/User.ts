// - This file defines a Mongoose schema and model for a User in a MongoDB database.

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const { hash, compare } = bcrypt;

const userSchema = new Schema(
  {


    username: {
      type: String,
      unique: true,
      required: true,
      trimmed: true,

    },
    email: {
      type: String,
      required: true,
      unique: true,

      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],

    },
    password: {
      type: String,
      minLength: [6, 'Your password must be at least 6 characters in length'],

    },
  
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform(_, user) {
        delete user.password;
        delete user.__v;
        return user;
      }
    },
    toObject: {
      virtuals: true,
    }
  }
);

// MIDDLEWARE //

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

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
})

const User = model('User', userSchema);

export default User; 