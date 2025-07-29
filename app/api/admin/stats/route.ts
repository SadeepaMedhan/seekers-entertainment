import { NextResponse } from "next/server"

export async function GET() {
  // Mock stats - replace with actual database queries
  const stats = {
    packages: 3,
    media: 6,
    inquiries: 0,
  }

  return NextResponse.json(stats)
}
