import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"
import connectDB from "@/lib/mongodb"
import Media from "@/models/Media"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    
    // Build filter object
    let filter: any = {}
    
    if (category && category !== 'All') {
      filter.category = category
    }
    
    if (type) {
      filter.type = type
    }
    
    // Fetch media items from database
    const mediaItems = await Media.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .lean() // Return plain JavaScript objects for better performance
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedItems = mediaItems.map((item: any) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Create new media document
    const newMedia = new Media({
      url: body.url,
      type: body.type,
      category: body.category,
      title: body.title,
      description: body.description || '',
      filename: body.filename,
      size: body.size || 0,
      mimeType: body.mimeType,
      thumbnailUrl: body.thumbnailUrl || null,
      metadata: body.metadata || {}
    })
    
    const savedMedia = await newMedia.save()
    
    // Format response
    const responseMedia = {
      ...savedMedia.toObject(),
      id: savedMedia._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(responseMedia, { status: 201 })
  } catch (error) {
    console.error("Error creating media:", error)
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 })
  }
}

// Delete media item
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 })
    }
    
    const mediaItem = await Media.findById(id)
    if (!mediaItem) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }
    
    // Delete physical file if it's not a placeholder
    if (mediaItem.filename && !mediaItem.filename.includes('placeholder')) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', mediaItem.filename)
        await unlink(filePath)
      } catch (fileError) {
        console.warn("Failed to delete file:", fileError)
        // Continue with database deletion even if file deletion fails
      }
    }
    
    // Delete from database
    await Media.findByIdAndDelete(id)
    
    return NextResponse.json({ message: "Media deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
