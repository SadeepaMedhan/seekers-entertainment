import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Inquiry from "@/models/Inquiry"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const inquiry = await Inquiry.findById(id).lean()
    
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }
    
    // Format response
    const formattedInquiry = {
      ...(inquiry as any),
      id: (inquiry as any)._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedInquiry)
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 })
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
    
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    if (!updatedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }
    
    // Format response
    const formattedInquiry = {
      ...updatedInquiry.toObject(),
      id: updatedInquiry._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedInquiry)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const deletedInquiry = await Inquiry.findByIdAndDelete(id)
    
    if (!deletedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Inquiry deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}
