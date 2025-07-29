import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database
const inquiries: any[] = []

export async function GET() {
  return NextResponse.json(inquiries)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newInquiry = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    inquiries.push(newInquiry)

    // Here you would typically send an email notification
    // await sendEmailNotification(newInquiry)

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
