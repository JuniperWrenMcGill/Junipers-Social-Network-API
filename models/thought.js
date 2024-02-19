const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reaction Schema as a subdocument to Thought
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Automatically generate a new ObjectId
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280, // Ensure reaction body does not exceed 280 characters
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to the current timestamp
    get: (timestamp) => timestamp.toLocaleString(), // Format timestamp on retrieval
  },
}, {
  toJSON: {
    getters: true, // Enable the use of getters
  },
  id: false, // DO NOT include the `id` virtual field
});

// Thought Schema
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1, // Ensure thoughtText is at least 1 character long
    maxlength: 280, // and does not exceed 280 characters
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to the current timestamp
    get: (timestamp) => timestamp.toLocaleString(), // Format timestamp on retrieval
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], // Embed the reactionSchema for reactions
}, {
  toJSON: {
    virtuals: true, // Ensure virtual fields are included in JSON output
    getters: true, // Enable the use of getters in the schema
  },
  id: false,
});

// Virtual for reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length; // Returns the number of reactions
});

// Create and export the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
