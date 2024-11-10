// This file is describing the structure and behavior of a Thought object.
import mongoose from 'mongoose';
// TODO - Types import notes
const { Schema, model, Types } = mongoose;
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: [280, 'Your reaction may not exceed 280 characters']
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => timestamp.toLocaleString(),
    },
}, {
    toJSON: {
        getters: true,
    },
    id: false,
});
const thoughtSchema = new Schema(
// Each 'Thought' object is going to have 'thought text', 'created at', 'username', and 'reactions'
{
    thoughtText: {
        type: String,
        required: true,
        minLength: [1, 'Your thought text must be at least one character'],
        maxLength: [280, 'Your thought text may not exceed 280 characters'],
    },
    createdAt: {
        type: Date,
        // - This automatically sets the current date and time when a new document is created.
        default: Date.now,
        // TODO - Use a getter method to format the timestamp on query.
    },
    username: {
        type: String, // TODO String type or Schema.Types.ObjectId ?
        ref: 'User',
        required: true,
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    toObject: {
        virtuals: true,
    },
});
// TODO notes and reaction schema notes
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});
const Thought = model('Thought', thoughtSchema);
export default Thought;
