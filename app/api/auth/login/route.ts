import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ADMIN_EMAIL = "admin@seekersentertainment.com"
const ADMIN_PASSWORD = "admin123" // In production, use hashed passwords
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "24h" })

      return NextResponse.json({ token })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
