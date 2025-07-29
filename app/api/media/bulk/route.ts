import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Media from '@/models/Media'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { ids, category } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      )
    }
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }
    
    const result = await Media.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { 
          category,
          updatedAt: new Date()
        }
      }
    )
    
    return NextResponse.json({
      message: `${result.modifiedCount} items updated successfully`,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Bulk categorize error:', error)
    return NextResponse.json(
      { error: 'Failed to categorize items' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    
    const { ids } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      )
    }
    
    // Get media items to delete their files
    const mediaItems = await Media.find({ _id: { $in: ids } })
    
    // Delete files from filesystem
    const deletePromises = mediaItems.map(async (item) => {
      try {
        const filePath = join(process.cwd(), 'public', item.url.replace(/^\//, ''))
        await unlink(filePath)
      } catch (error) {
        console.warn(`Failed to delete file: ${item.url}`, error)
      }
    })
    
    await Promise.allSettled(deletePromises)
    
    // Delete from database
    const result = await Media.deleteMany({ _id: { $in: ids } })
    
    return NextResponse.json({
      message: `${result.deletedCount} items deleted successfully`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete items' },
      { status: 500 }
    )
  }
}
