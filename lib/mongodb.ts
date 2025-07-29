import mongoose from 'mongoose'

const MONGODB_URI ='mongodb+srv://sadeepamedhan823:rheaanzRKSdq3zD5@seeker.pbu8koy.mongodb.net/seekers-entertainment?retryWrites=true&w=majority&appName=seeker'


if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Simple connection cache
let isConnected = false

async function connectDB() {
  if (isConnected) {
    return mongoose
  }

  try {
    const db = await mongoose.connect(MONGODB_URI!)
    
    isConnected = true
    console.log('Connected to MongoDB')
    
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB
