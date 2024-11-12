// This file defines the controller functions for handling API requests.

// - Importing the Request and Response objects from the Express library.
// - Lets me use these to define the request and responses parameters in my functions.
import { Request, Response } from 'express';
import User from '../models/User.js';
import Thought from '../models/Thought.js';


// DONE
export async function getAllUsers(_: Request, res: Response) {
  const user = await User.find();

  res.json({
    user: user
  })
}

// DONE
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

// DONE
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
      for (const prop in error.errors) {
        errors.push(error.errors[prop].message);
      }
    }
    res.status(403).json({
      errors: errors
    })
  }
};

// DONE
export async function updateUserById(req: Request, res: Response) {

  const user_id = req.params.user_id;
  const username = req.body.username;

  const updatedUser = await User.findByIdAndUpdate(user_id, {
    username: username
  }, { new: true });

  res.json({
    message: "User information updated!",
    user: updatedUser
  })
}

// DONE
export async function deleteUserById(req: Request, res: Response) {
  const user_id = req.params.user_id;

  await User.deleteOne({
    _id: user_id
  });

  res.json({
    message: "User removed successfully."
  })
}


// DONE
export async function addFriendToFriendsList(req: Request, res: Response) {

  const friendId = req.params.friendId;

  await User.findByIdAndUpdate(req.params.userId, {
    $push: { friends: friendId }
  });

  res.json({
    message: "friend added",
  })

}

/// DONE
export async function deleteFriendById(req: Request, res: Response) {

  const userId = req.params.userId;
  const friendId = req.params.friendId;

  await User.findByIdAndUpdate(userId, {
    $pull: { friends: friendId }
  });


  res.json({
    message: 'Friend deleted'
  })
}



// DONE
export async function getAllThoughts(_: Request, res: Response) {
  try {
    const thoughts = await Thought.find().populate({
      path: 'user',

    });
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

// DONE
export async function getSingleThoughtById(req: Request, res: Response) {
  const thought_id = req.params.thought_id;

  const user = await Thought.findById(thought_id);

  res.json({
    user: user
  })
};

// DONE
export async function addNewThought(req: Request, res: Response) {
  const thought = await Thought.create(req.body);
  await User.findByIdAndUpdate(req.body.user, {
    $push: { thoughts: thought._id }
  });
  res.json({
    thought: thought
  });
};

// DONE
export async function updateThoughtById(req: Request, res: Response) {

  const thought_id = req.params.thought_id;
  const thoughtText = req.body.thoughtText;

  const updatedThought = await Thought.findByIdAndUpdate(thought_id, {
    thoughtText: thoughtText
  }, { new: true });

  res.json({
    message: "Thought information updated!",
    thought: updatedThought
  })
}

// DONE
export async function deleteThoughtById(req: Request, res: Response) {
  const thought_id = req.params.thought_id;

  await Thought.deleteOne({
    _id: thought_id
  });

  res.json({
    message: "Thought removed successfully."
  })
}
// DONE
export async function addNewReaction(req: Request, res: Response) {
  try {
    const thought_id = req.params.thought_id;
    const { reactionBody, username } = req.body;

    const updatedThought = await Thought.findByIdAndUpdate(
      thought_id,
      {
        $push: { reactions: { reactionBody, username, createdAt: new Date() } }
      },
      { new: true }
    );

    res.json({
      message: "Reaction added successfully!",
      thought: updatedThought
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

// DONE
export async function deleteReactionById(req: Request, res: Response) {
  const { thoughtId, reaction_id } = req.params;

  try {
    await Thought.updateOne(
      { _id: thoughtId, 'reactions.reactionId': reaction_id },
      { $pull: { reactions: { reactionId: reaction_id } } }
    );

    res.json({
      message: 'Reaction deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting reaction.',
    });
  }
}