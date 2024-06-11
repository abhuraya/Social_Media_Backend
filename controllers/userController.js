const { User,Thought } = require('../models');

module.exports = {
    //gets all users and associated thoughts and friends, only displays the _id for thoughts and friends
    async getUsers(req, res) {
        try{
            const users = await User.find();
            res.json(users);
        }catch (error){
            res.status(500).json(error);
            console.error(error)
        }
    },

    // gets a single user by _id and displays the full objects of all friends and thoughts
    async getSingleUser(req, res) {
        try{
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends');
            if(!user) {
                return res.status(404).json({ error: `no user matching id: ${req.params.userId}` })
            }
            res.json(user);
        }catch (err){
            res.status(500).json(err);
        }
    },
    
    // creates a user
    async createUser(req, res) {
        try{
            const user = await User.create(req.body);
            res.json(user);
        }catch (err) {
            res.status(500).json(err)
        }
    },

    //updates a user based on _id
    async updateUser (req, res) {
        try{
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res.status(404).json({ error: `no user with id: ${req.params.userId}` })
            }

            res.json(user);
        }catch (err) {
            res.status(500).json(err)
        }
    },

    // deletes a user based on _id
    async deleteUser (req, res) {
        try{
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if(!user) {
                res.status(404).json({ error: `no user with id:  ${req.params.userId}` })
            }

            // iterates over the user's thoughts list and removes any thoughts from the database with the user
            for(let i = 0; i < user.thoughts.length; i++ ){
                await Thought.findByIdAndDelete({ _id: user.thoughts[i]._id })
            }

            res.json({ message: 'User deleted and thoughts deleted' })
        }catch(err) {
            res.status(500).json(err);
            console.error(err)
        }
    },

    // adds a friend to users friends list based on both user's _ids
    async addFriend (req, res) {
        try{
            const user = await User.findOne({_id: req.params.userId});
            const friend = await User.findOne({_id: req.params.friendId});

            // aditional logic to verify that both users exist
            if (!user || !friend){
                if (!user) {
                    return res.status(404).json({ error: `no user with id matching : ${user}` })
                } else if (!friend) {
                    return res.status(404).json({ error: `no user with id matching: ${friend}` })
                }
            }

            if (user.friends.includes(friend._id)){
                return res.json({ message: 'user already in freinds list' })
            } else {
                user.friends.push(friend);
                user.save();
            }

        res.status(200).json({ message: `${friend.username} added to ${user.username}'s freinds list` })
        }catch(err){
            res.status(500).json(err);
            console.error(err);
        }
    },

    // removes a user from another user's friends list by associated _ids
    async deleteFriend (req, res) {
        try{
            const user = await User.findOne({_id: req.params.userId});
            const friend = await User.findOne({_id: req.params.friendId});

            // aditional logic to verify that both users exist
            if (!user || !friend){
                if (!user) {
                    return res.status(404).json({ error: `no user with id matching : ${user}` })
                } else if (!friend) {
                    return res.status(404).json({ error: `no user with id matching: ${friend}` })
                }
            }

            
            if (user.friends.includes(friend._id)){
                user.friends.pop(friend._id);
                user.save();

                res.status(200).json({ message: `${friend.username} removed from ${user.username}'s friendslist` })

            } else {
                return res.status(404).json({ message: `${friend.username} is not in ${user.username}'s friendslist` })
            }

        }catch(err){
            res.status(500).json(err);
            console.error(err);
        }
    }
}