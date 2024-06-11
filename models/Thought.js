const { ObjectId } = require('bson');
const { Schema, model } = require('mongoose');

//schema for creating a reaction
const reactionSchema = new Schema(
    {
        reactionBody: {
            type: String,
            required: true,
            maxlength: 200
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

//schema for creating a thought
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

//virtual for keeping count of reactiongs
thoughtSchema
.virtual('reactionCount')
.get(function () {
    return this.reactions.length;
})
const Thought = model('thought', thoughtSchema);

module.exports = Thought;