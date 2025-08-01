import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { BackgroundProvider } from "@/components/background-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Seeker's Entertainment Pvt Ltd - Premier Event Services",
  description:
    "Professional DJ, sound systems, lighting, LED screens, and event decor services for unforgettable celebrations.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BackgroundProvider>
            {children}
            <Toaster />
          </BackgroundProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
