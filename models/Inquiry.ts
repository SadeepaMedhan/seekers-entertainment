import mongoose from 'mongoose'

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['Wedding', 'Corporate', 'Party', 'Concert', 'Festival', 'Other'],
    default: 'Other',
  },
  eventDate: {
    type: Date,
    default: null,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'booked', 'completed'],
    default: 'new',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

// Index for better query performance
InquirySchema.index({ status: 1, createdAt: -1 })
InquirySchema.index({ eventDate: 1 })
InquirySchema.index({ email: 1 })

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema)
