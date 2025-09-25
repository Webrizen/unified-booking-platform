import { ObjectId } from 'mongodb';

// This is a blueprint for the data structure, not a Mongoose model.
export const userModel = {
  _id: ObjectId, // MongoDB's unique identifier
  
  // User's name
  name: {
    firstName: String,
    lastName: String,
  },
  
  // Contact information
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  
  // Hashed password for security
  password: {
    type: String,
    required: true,
  },
  
  // User roles (e.g., 'user', 'admin')
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  
  // Timestamps for creation and updates
  createdAt: Date,
  updatedAt: Date,
};
