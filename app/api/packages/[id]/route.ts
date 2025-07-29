import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Package from "@/models/Package"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const packageItem = await Package.findById(id).lean()
    
    if (!packageItem) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }
    
    // Format response
    const formattedPackage = {
      ...(packageItem as any),
      id: (packageItem as any)._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(formattedPackage)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    const { id } = params
    const deletedPackage = await Package.findByIdAndDelete(id)

    if (!deletedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Package deleted successfully" })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    const { id } = params
    const body = await request.json()
    
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!updatedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Format response
    const formattedPackage = {
      ...updatedPackage.toObject(),
      id: updatedPackage._id.toString(),
      _id: undefined
    }

    return NextResponse.json(formattedPackage)
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}
