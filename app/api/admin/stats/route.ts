import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Media from "@/models/Media"
import Package from "@/models/Package"
import Inquiry from "@/models/Inquiry"

export async function GET() {
  try {
    await connectDB()
    
    // Get actual counts from database
    const [mediaCount, packageCount, inquiryCount] = await Promise.all([
      Media.countDocuments(),
      Package.countDocuments({ active: true }),
      Inquiry.countDocuments()
    ])
    
    const stats = {
      packages: packageCount,
      media: mediaCount,
      inquiries: inquiryCount,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    // Return default stats if database fails
    const stats = {
      packages: 0,
      media: 0,
      inquiries: 0,
    }
    return NextResponse.json(stats)
  }
}
