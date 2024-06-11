const router = require('express').Router();

// imports all functins for user routes
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/userController.js');

// routes for getting all users and creating a single user
router.route('/').get(getUsers).post(createUser);

//routes for getting, updating, or deleting a single user
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);


// routes for creating and removing a frined from a specific friendslist
router.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(deleteFriend);


module.exports = router;