import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Inquiry from "@/models/Inquiry"

export async function GET() {
  try {
    await connectDB()
    
    const inquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .lean()
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedInquiries = inquiries.map((inquiry: any) => ({
      ...inquiry,
      id: inquiry._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json(formattedInquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    const newInquiry = new Inquiry({
      name: body.name,
      email: body.email,
      phone: body.phone,
      eventType: body.eventType || 'Other',
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      message: body.message,
      status: 'new',
      notes: body.notes || ''
    })
    
    await newInquiry.save()

    // Here you would typically send an email notification
    // await sendEmailNotification(newInquiry)

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating inquiry:", error)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
