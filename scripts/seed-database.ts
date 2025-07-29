import connectDB from "@/lib/mongodb"
import Media from "@/models/Media"
import Package from "@/models/Package"
import Inquiry from "@/models/Inquiry"

async function seedDatabase() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Media.deleteMany({})
    await Package.deleteMany({})
    await Inquiry.deleteMany({})
    console.log('Cleared existing data')

    // Seed Media
    const mediaItems = [
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Weddings",
        title: "Elegant Wedding Setup",
        description: "Beautiful wedding reception with premium lighting",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Corporate",
        title: "Corporate Event",
        description: "Professional corporate event setup",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Parties",
        title: "Birthday Celebration",
        description: "Vibrant birthday party setup",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Concerts",
        title: "Concert Stage",
        description: "Professional concert stage setup",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Festivals",
        title: "Festival Stage",
        description: "Large-scale festival production",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        type: "image",
        category: "Weddings",
        title: "Wedding Ceremony",
        description: "Romantic wedding ceremony setup",
        filename: "placeholder.svg",
        size: 0,
        mimeType: "image/svg+xml"
      }
    ]

    await Media.insertMany(mediaItems)
    console.log('Seeded media items')

    // Seed Packages
    const packages = [
      {
        title: "Basic Package",
        description: "Perfect for small gatherings and intimate celebrations",
        price: 15000,
        features: [
          "Professional DJ for 4 hours",
          "Basic sound system",
          "LED uplighting",
          "Wireless microphone",
          "Music requests handling",
        ],
        image: "/placeholder.svg?height=300&width=400",
        popular: false,
        active: true
      },
      {
        title: "Premium Package",
        description: "Ideal for weddings and corporate events",
        price: 35000,
        features: [
          "Professional DJ for 6 hours",
          "Premium sound system",
          "Advanced lighting setup",
          "2 wireless microphones",
          "LED screen display",
          "Photography (2 hours)",
          "Custom playlist creation",
        ],
        popular: true,
        image: "/placeholder.svg?height=300&width=400",
        active: true
      },
      {
        title: "Luxury Package",
        description: "Complete event solution for grand celebrations",
        price: 75000,
        features: [
          "Professional DJ for 8 hours",
          "Premium sound & lighting",
          "LED screens & displays",
          "Live streaming setup",
          "Photography & videography",
          "Event decoration",
          "Drone coverage",
          "Same-day video editing",
        ],
        popular: false,
        image: "/placeholder.svg?height=300&width=400",
        active: true
      }
    ]

    await Package.insertMany(packages)
    console.log('Seeded packages')

    // Seed some sample inquiries (optional)
    const inquiries = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        eventType: "Wedding",
        eventDate: new Date('2024-06-15'),
        message: "Looking for a wedding package for 150 guests",
        status: "new"
      },
      {
        name: "Jane Smith",
        email: "jane@company.com",
        phone: "+0987654321",
        eventType: "Corporate",
        eventDate: new Date('2024-08-20'),
        message: "Need entertainment for company annual party",
        status: "contacted"
      }
    ]

    await Inquiry.insertMany(inquiries)
    console.log('Seeded inquiries')

    console.log('Database seeded successfully!')
    process.exit(0)

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeder
seedDatabase()
