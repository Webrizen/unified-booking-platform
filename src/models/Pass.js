import { ObjectId } from 'mongodb';

export const passModel = {
  _id: ObjectId,
  bookingId: {
    type: ObjectId,
    ref: 'Booking',
    required: true,
  },
  passType: {
    type: String,
    enum: ['marriageGarden'],
    required: true,
  },
  details: {
    eventName: {
      type: String,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    accessLevel: {
      type: String, // e.g., 'full-access', 'dining-only'
      default: 'full-access',
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