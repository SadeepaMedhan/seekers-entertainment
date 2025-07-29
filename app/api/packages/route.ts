import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Package from "@/models/Package"

export async function GET() {
  try {
    await connectDB()
    
    const packages = await Package.find({ active: true })
      .sort({ popular: -1, createdAt: -1 })
      .lean()
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedPackages = packages.map((pkg: any) => ({
      ...pkg,
      id: pkg._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json(formattedPackages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    const newPackage = new Package({
      title: body.title,
      description: body.description,
      price: body.price,
      features: body.features,
      image: body.image || '/placeholder.svg?height=300&width=400',
      popular: body.popular || false,
      active: body.active !== undefined ? body.active : true,
    })
    
    const savedPackage = await newPackage.save()
    
    // Format response
    const responsePackage = {
      ...savedPackage.toObject(),
      id: savedPackage._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json(responsePackage, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}
