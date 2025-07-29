import mongoose from 'mongoose'

const backgroundSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'services', 'packages', 'gallery', 'testimonials', 'contact'],
    unique: true
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['image', 'video']
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: false
  },
  fallbackImageUrl: {
    type: String,
    required: false // For videos, this can be a fallback image
  },
  opacity: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  overlayColor: {
    type: String,
    default: '#000000'
  },
  position: {
    type: String,
    default: 'center',
    enum: ['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

backgroundSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Background = mongoose.models.Background || mongoose.model('Background', backgroundSchema)

export default Background
