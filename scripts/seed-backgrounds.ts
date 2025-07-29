import connectDB from '@/lib/mongodb'
import Background from '@/lib/models/Background'

async function seedBackgrounds() {
  try {
    await connectDB()
    
    const defaultBackgrounds = [
      {
        section: 'hero',
        mediaType: 'image',
        mediaUrl: '/placeholder.svg?height=1080&width=1920&text=Hero+Background',
        opacity: 0.5,
        overlayColor: '#000000',
        position: 'center',
        isActive: true,
        title: 'Hero Section Background',
        description: 'Main hero section background image'
      },
      {
        section: 'services',
        mediaType: 'image',
        mediaUrl: '/placeholder.svg?height=800&width=1920&text=Services+Background',
        opacity: 0.3,
        overlayColor: '#1a1a1a',
        position: 'center',
        isActive: true,
        title: 'Services Section Background',
        description: 'Background for services section'
      },
      {
        section: 'packages',
        mediaType: 'image',
        mediaUrl: '/placeholder.svg?height=800&width=1920&text=Packages+Background',
        opacity: 0.4,
        overlayColor: '#000000',
        position: 'center',
        isActive: true,
        title: 'Packages Section Background',
        description: 'Background for packages section'
      }
    ]

    for (const backgroundData of defaultBackgrounds) {
      const existingBackground = await Background.findOne({ section: backgroundData.section })
      
      if (!existingBackground) {
        const background = new Background(backgroundData)
        await background.save()
        console.log(`Created background for ${backgroundData.section} section`)
      } else {
        console.log(`Background for ${backgroundData.section} section already exists`)
      }
    }

    console.log('Background seeding completed!')
  } catch (error) {
    console.error('Error seeding backgrounds:', error)
  }
}

// Export for potential use in development
export default seedBackgrounds
