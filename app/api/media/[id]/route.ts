import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"
import connectDB from "@/lib/mongodb"
import Media from "@/models/Media"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const mediaItem = await Media.findById(id).lean()
    
    if (!mediaItem) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }
    
    // Format response
    const formattedItem = {
      ...(mediaItem as any),
      id: (mediaItem as any)._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedItem)
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const body = await request.json()
    
    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    if (!updatedMedia) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }
    
    // Format response
    const formattedMedia = {
      ...updatedMedia.toObject(),
      id: updatedMedia._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedMedia)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
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
