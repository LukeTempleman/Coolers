// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { Schema, models, model } from 'mongoose';

const CoolerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  initialLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  radius: {
    type: Number,
    default: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastNotification: Date,
  locationHistory: [
    {
      coordinates: [Number],
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

CoolerSchema.index({ initialLocation: '2dsphere' });

export default models.Cooler || model('Cooler', CoolerSchema);
