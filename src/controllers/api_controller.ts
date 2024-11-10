// This file defines the controller functions for handling API requests.

// - Importing the Request and Response objects from the Express library.
// - Lets me use these to define the request and responses parameters in my functions.
import { Request, Response } from 'express';
import User from '../models/User.js';
import Thought from '../models/Thought.js';

// GET all users TESTED & FUNCTIONING
export async function getAllUsers(_: Request, res: Response) {
  const user = await User.find();

  res.json({
    user: user
  })
}

// GET single user by ID TESTED & FUNCTIONING
export async function getSingleUserById(req: Request, res: Response) {
  const user_id = req.params.user_id;

  const user = await User.findById(user_id).populate({
    path: 'thoughts',
    select: 'reactionBody'
  });

  res.json({
    user: user
  })
}

// POST a new user - TESTED & FUNCTIONING
export async function createUser(req: Request, res: Response) {
  // put the code that might throw an error. 'Try to execute it'.
  try {
    const user = await User.create(req.body);
    res.json({
      user: user
    });
    // catch - if an error occurs in the try block, the code inside the catch block will run.
  } catch (error: any) {
    const errors: String[] = [];
    console.log(error);

    if (error.code === 11000) {
      errors.push('That eamil address is already in use');
    } else {
      for (const prop in error.erros) {
        errors.push(error.errors[prop].message);
      }
    }
    res.status(403).json({
      errors: errors
    })
  }
};

// PUT to update a user by it's _id
export async function updateUserById(req: Request, res: Response) {

  const thought_id = req.body.thought_id;
  const user_id = req.body.user_id;

  await User.findByIdAndUpdate(user_id, {
    $pull: {
      thoughts: thought_id
    }
  });

  res.json({
    message: "User information updated!"
  })
}

// DELETE to remove a user by it's _id
export async function deleteUserById(req: Request, res: Response) {
  const user_id = req.body.user_id;

  await User.deleteOne({
    _id: user_id
  });

  // TODO remove a user's associated thoughts when deleted

  res.json({
    message: "User removed successfully."
  })
}

// TODO POST to add a new friend to a user's friend list
// export async function addNewFriendToFriendList(req: Request, res: Response) {
//   const user = await User.findById(req.body.user_id);

// }

// TODO DELETE to remove a friend from a user's friend list


// DONE GET to get all thoughts
export async function getAllThoughts(_: Request, res: Response) {
  const thoughts = await Thought.find().populate({
    path: 'user',
    populate: {
      path: 'thoughts'
    }
  });
  res.json(thoughts)
}

// DONE GET to get a single thought by it's _id
export async function getSingleThoughtById(req: Request, res: Response) {
  const thought_id = req.params.thought_id;

  const user = await Thought.findById(thought_id).populate({
    path: 'thoughts',
    select: 'reactionBody'
    // TODO - remove populate and reaction body? 
  });

  res.json({
    user: user
  })
}

// TODO POST to create a new thought (and push created thought's _id to the associated user's thoughts array field)


// TODO PUT to update a thought by it's _id


// TODO DELETE to remove a thought by it's _id


// TODO POST to create a reaction stored in a single thought's reactions array field


// TODO DELETE to pull and remove a reaction by the reaction's reaction_Id value
