const { Schema, Types } = require('mongoose');

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
            //getter method for timestamp query
        },
        username: {
            type: String,
            required: true,
            refrence:{
                model: 'usernameSchema',
                key: 'username',
            },
        },
        reactions: {
            type: Array,
            //nested reactionsSchema
        }
    }
)