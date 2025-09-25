import { ObjectId } from 'mongodb';

export const ticketModel = {
  _id: ObjectId,
  bookingId: {
    type: ObjectId,
    ref: 'Booking',
    required: true,
  },
  ticketType: {
    type: String,
    enum: ['waterPark'],
    required: true,
  },
  details: {
    type: {
      type: String, // e.g., 'adult', 'child', 'vip'
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  qrCode: {
    type: String, // URL or data for the QR code
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'expired'],
    default: 'valid',
  },
  createdAt: Date,
  updatedAt: Date,
};