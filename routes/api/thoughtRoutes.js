const router = require('express').Router();
// imports all functions for thr routes
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

// routes for getting all thoughts and creating one thought
router.route('/')
.get(getThoughts)
.post(createThought);

// routes for getting, updating, or deleteing a single thought
router.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

// route for creating a reaction
router.route('/:thoughtId/reactions')
.post(addReaction)

// route for deleting a reaciton
router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction)

module.exports = router;