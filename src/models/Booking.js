import { ObjectId } from 'mongodb';

export const bookingModel = {
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  resourceId: {
    type: ObjectId,
    ref: 'Resource',
    required: true,
  },
  bookingType: {
    type: String,
    required: true,
    enum: ['room', 'marriageGarden', 'waterPark'],
  },
  details: {
    roomBooking: {
      checkInDate: Date,
      checkOutDate: Date,
      guests: {
        adults: Number,
        children: Number,
      },
    },
    gardenBooking: {
      eventDate: Date,
      timeSlot: String,
      services: [String],
    },
    waterParkBooking: {
      date: Date,
      tickets: [{
        type: ObjectId,
        ref: 'Ticket',
      }],
    },
  },
  passes: [{
    type: ObjectId,
    ref: 'Pass',
  }],
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdBy: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: Date,
  updatedAt: Date,
};