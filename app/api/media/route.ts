import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database
const mediaItems = [
  {
    id: "1",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Weddings",
    title: "Elegant Wedding Setup",
    description: "Beautiful wedding reception with premium lighting",
  },
  {
    id: "2",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Corporate",
    title: "Corporate Event",
    description: "Professional corporate event setup",
  },
  {
    id: "3",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Parties",
    title: "Birthday Celebration",
    description: "Vibrant birthday party setup",
  },
  {
    id: "4",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Concerts",
    title: "Concert Stage",
    description: "Professional concert stage setup",
  },
  {
    id: "5",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Festivals",
    title: "Festival Stage",
    description: "Large-scale festival production",
  },
  {
    id: "6",
    url: "/placeholder.svg?height=400&width=600",
    type: "image",
    category: "Weddings",
    title: "Wedding Ceremony",
    description: "Romantic wedding ceremony setup",
  },
]

export async function GET() {
  return NextResponse.json(mediaItems)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newMedia = {
      id: Date.now().toString(),
      ...body,
    }
    mediaItems.push(newMedia)
    return NextResponse.json(newMedia, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
