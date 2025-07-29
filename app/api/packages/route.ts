import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database
const packages = [
  {
    id: "1",
    title: "Basic Package",
    description: "Perfect for small gatherings and intimate celebrations",
    price: 15000,
    features: [
      "Professional DJ for 4 hours",
      "Basic sound system",
      "LED uplighting",
      "Wireless microphone",
      "Music requests handling",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    title: "Premium Package",
    description: "Ideal for weddings and corporate events",
    price: 35000,
    features: [
      "Professional DJ for 6 hours",
      "Premium sound system",
      "Advanced lighting setup",
      "2 wireless microphones",
      "LED screen display",
      "Photography (2 hours)",
      "Custom playlist creation",
    ],
    popular: true,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    title: "Luxury Package",
    description: "Complete event solution for grand celebrations",
    price: 75000,
    features: [
      "Professional DJ for 8 hours",
      "Premium sound & lighting",
      "LED screens & displays",
      "Live streaming setup",
      "Photography & videography",
      "Event decoration",
      "Drone coverage",
      "Same-day video editing",
    ],
    image: "/placeholder.svg?height=300&width=400",
  },
]

export async function GET() {
  return NextResponse.json(packages)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newPackage = {
      id: Date.now().toString(),
      ...body,
    }
    packages.push(newPackage)
    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
