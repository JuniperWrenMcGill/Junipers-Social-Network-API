const { Thought, User } = require('../models');

module.exports = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(thoughts => res.json(thoughts))
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by ID
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  // POST a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(thought => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then(user => res.json(user))
      .catch(err => {
        console.error(err);
        res.status(400).json(err);
      });
  },

  // PUT to update a thought by ID
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err));
  },

  // DELETE a thought by ID
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch(err => res.status(400).json(err));
  },

  // POST to create a reaction
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id to add a reaction!' });
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err));
  },

  // DELETE to remove a reaction
  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id to remove a reaction!' });
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err));
  }
};
