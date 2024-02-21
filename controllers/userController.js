const { Thought, User } = require('../models');

module.exports = {
    // GET all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(users => res.json(users))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // GET a single user by ID
    getUserById(req, res) {
        User.findById(req.params.id)
            .populate({
                path: 'thoughts friends',
                select: '-__v'
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // POST a new user
    createUser(req, res) {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // PUT to update a user by ID
    updateUser(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a user by ID
    deleteUser(req, res) {
        User.findByIdAndDelete(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                // Also delete the user's associated thoughts
                Thought.deleteMany({ username: user.username })
                    .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    // POST to add a friend
    addFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } },
            { new: true, runValidators: true }
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE to remove a friend
    removeFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    }
};