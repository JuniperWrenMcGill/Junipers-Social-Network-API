const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true, // Automatically trims whitespace
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Simple regex for email validation
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought', // Reference to the Thought model
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Self-reference to create a friends list
    }
  ],
}, {
  toJSON: {
    virtuals: true, // Ensure virtual fields are included in JSON output
  },
  id: false, // Prevent id virtual for duplicating _id
});

// Virtual for friendCount
userSchema.virtual('friendCount').get(function() {
  return this.friends.length; // Returns the number of friends
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;