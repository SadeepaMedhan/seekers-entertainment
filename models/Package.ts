import mongoose from 'mongoose'

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    default: '/placeholder.svg?height=300&width=400',
  },
  popular: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Index for better query performance
PackageSchema.index({ active: 1, popular: -1 })
PackageSchema.index({ price: 1 })

export default mongoose.models.Package || mongoose.model('Package', PackageSchema)
