"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import { motion } from "framer-motion"

interface Package {
  id: string
  title: string
  description: string
  price: number
  features: string[]
  popular?: boolean
  image: string
}

export function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch packages from API
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages")
        if (response.ok) {
          const data = await response.json()
          setPackages(data)
        } else {
          // Fallback to default packages
          setPackages(defaultPackages)
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
        setPackages(defaultPackages)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const defaultPackages: Package[] = [
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

  if (loading) {
    return (
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="packages" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Event Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully crafted packages or let us create a custom solution for your unique event needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full relative ${pkg.popular ? "ring-2 ring-primary" : ""}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader>
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img src={pkg.image || "/placeholder.svg"} alt={pkg.title} className="w-full h-full object-cover" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="text-3xl font-bold text-primary">LKR.{pkg.price.toLocaleString()}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Book This Package
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
