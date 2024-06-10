const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId:{
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
            reference: {
                model: 'usernameSchema',
                key: 'username',
            }
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //getter method
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

module.exports = reactionSchema;