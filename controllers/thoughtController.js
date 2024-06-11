const { User, Thought } = require('../models');

module.exports = {
    // gets all thoughts, only shows the reaction id not the full object
    async getThoughts (req, res) {
        try{
            const thoughts = await Thought.find()
            res.json(thoughts);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },

    // gets a single thoguht by its _id and shows the full reaction object for each reaction it has
    async getSingleThought (req, res) {
        try{
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions');
            if(!thought){
                return res.status(404).json({ error: `no thought with id: ${req.params.thoughtId}` });
            }
            res.json(thought);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },

    // creates a thought
    async createThought (req, res) {
        try{
            const thought = await Thought.create(req.body);

            const user = await User.findOne({ _id: req.body.userId });

            if(!user) {
                return res.status(404).json({ error: `no user with id: ${req.body.userId}` })
            };

            user.thoughts.push(thought);

            await user.save();

            res.json(thought);
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },

    // updates a thought by the thought _id
    async updateThought (req, res) {
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if(!thought) {
                return res.status(404).json({ error: `no thought with id: ${req.params.thoughtId}` })
            }
            res.json(thought)
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },

    // deletes a thought by the _id
    async deleteThought (req, res) {
        try{
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if(!thought){
                return res.status(404).json({ error: `no thought with id: ${req.params.thoughtId}` })
            }

            res.json({ message:`thought with id: ${req.params.thoughtId} deleted` })
        }catch (err) {
            res.status(500).json(err);
            console.error(err);
        }
    },

    // creates a reaction associated to a specific thought
    async addReaction (req, res) {
        try{
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if(!thought){
                return res.status(404).json({ error: `not thought with id matching: ${req.params.thoughtId}` });
            }

            const reaction = req.body;

            if(!reaction.reactionBody || !reaction.username) {

                if (!reaction.reactionBody){
                    return res.status(400).json({ error:`you must include a " "reactionBody": "your content here" "` })

                } else if (!reaction.username) {
                    return res.status(400).json({ error:`you must include a " "username": "username here" "` })
                }
            }

            thought.reactions.push({
                reactionBody: reaction.reactionBody,
                username: reaction.username
            })
            thought.save();

            res.status(200).json({ message: 'reaction added succesfuly' })
        }catch(err){
            res.status(500).json(err);
            console.error(err)
        }
    },

    // deletes a reaction by it's _id
    async deleteReaction(req, res) {
        try {
            const thoughtId = req.params.thoughtId;
            const reactionId = req.params.reactionId;

            const thought = await Thought.findOne({ _id: thoughtId });

            if (!thought) {
                return res.status(404).json({ error: `No thought found with id: ${thoughtId}` });
            }

            const reactionIndex = thought.reactions.findIndex((react) => String(react._id) === reactionId);

            if (reactionIndex === -1) {
                return res.status(404).json({ error: `No reaction found with id: ${reactionId}` });
            }
 
            thought.reactions.splice(reactionIndex, 1);
            await thought.save();
            
            res.status(200).json({ message: 'Reaction deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}