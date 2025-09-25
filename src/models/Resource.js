import { ObjectId } from 'mongodb';

export const resourceModel = {
  _id: ObjectId,
  
  resourceType: {
    type: String,
    required: true,
    enum: ['room', 'marriageGarden', 'waterPark'],
  },
  
  name: {
    type: String,
    required: true,
  },
  description: String,
  photos: [String],
  price: Number,
  
  details: {
    roomDetails: {
      beds: Number,
      capacity: Number,
    },
    gardenDetails: {
      maxCapacity: Number,
      features: [String],
    },
    waterParkDetails: {
      dailyCapacity: Number,
      sections: [String],
    },
  },
  
  availability: [Date],
  
  createdAt: Date,
  updatedAt: Date,
};
