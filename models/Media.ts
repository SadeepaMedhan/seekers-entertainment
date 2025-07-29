import mongoose from 'mongoose'

const MediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: null,
  },
  metadata: {
    width: Number,
    height: Number,
    duration: String, // For videos
    fps: Number, // For videos
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
})

// Index for better query performance
MediaSchema.index({ category: 1, type: 1 })
MediaSchema.index({ createdAt: -1 })

export default mongoose.models.Media || mongoose.model('Media', MediaSchema)
