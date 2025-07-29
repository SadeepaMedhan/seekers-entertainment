import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Background from '@/lib/models/Background'
import Media from '@/models/Media'

export async function GET() {
  try {
    await connectDB()
    
    const backgrounds = await Background.find().populate('mediaId').sort({ section: 1 })
    
    return NextResponse.json(backgrounds)
  } catch (error) {
    console.error('Error fetching backgrounds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backgrounds' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const {
      section,
      mediaType,
      mediaUrl,
      mediaId,
      fallbackImageUrl,
      opacity,
      overlayColor,
      position,
      title,
      description
    } = body

    // Validate required fields
    if (!section || !mediaType || !mediaUrl) {
      return NextResponse.json(
        { error: 'Section, mediaType, and mediaUrl are required' },
        { status: 400 }
      )
    }

    // Check if background for this section already exists
    const existingBackground = await Background.findOne({ section })
    
    if (existingBackground) {
      // Update existing background
      existingBackground.mediaType = mediaType
      existingBackground.mediaUrl = mediaUrl
      existingBackground.mediaId = mediaId || null
      existingBackground.fallbackImageUrl = fallbackImageUrl || null
      existingBackground.opacity = opacity !== undefined ? opacity : existingBackground.opacity
      existingBackground.overlayColor = overlayColor || existingBackground.overlayColor
      existingBackground.position = position || existingBackground.position
      existingBackground.title = title || existingBackground.title
      existingBackground.description = description || existingBackground.description
      existingBackground.updatedAt = new Date()
      
      await existingBackground.save()
      await existingBackground.populate('mediaId')
      
      return NextResponse.json(existingBackground)
    } else {
      // Create new background
      const background = new Background({
        section,
        mediaType,
        mediaUrl,
        mediaId: mediaId || null,
        fallbackImageUrl: fallbackImageUrl || null,
        opacity: opacity !== undefined ? opacity : 0.5,
        overlayColor: overlayColor || '#000000',
        position: position || 'center',
        title: title || '',
        description: description || ''
      })

      await background.save()
      await background.populate('mediaId')
      
      return NextResponse.json(background, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating background:', error)
    return NextResponse.json(
      { error: 'Failed to create/update background' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Background ID is required' },
        { status: 400 }
      )
    }

    const background = await Background.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('mediaId')

    if (!background) {
      return NextResponse.json(
        { error: 'Background not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(background)
  } catch (error) {
    console.error('Error updating background:', error)
    return NextResponse.json(
      { error: 'Failed to update background' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Background ID is required' },
        { status: 400 }
      )
    }

    const background = await Background.findByIdAndDelete(id)

    if (!background) {
      return NextResponse.json(
        { error: 'Background not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Background deleted successfully' })
  } catch (error) {
    console.error('Error deleting background:', error)
    return NextResponse.json(
      { error: 'Failed to delete background' },
      { status: 500 }
    )
  }
}
