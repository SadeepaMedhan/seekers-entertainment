"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Lightbulb, Monitor, Mic, Camera, Palette } from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    icon: Music,
    title: "Professional DJ Services",
    description: "Expert DJs with extensive music libraries and crowd-reading skills to keep your event energetic.",
    features: ["Custom playlists", "Live mixing", "MC services", "Request handling"],
  },
  {
    icon: Lightbulb,
    title: "Premium Lighting",
    description: "Transform your venue with our state-of-the-art lighting systems and effects.",
    features: ["LED uplighting", "Moving head lights", "Laser shows", "Custom programming"],
  },
  {
    icon: Monitor,
    title: "LED Screens & Displays",
    description: "High-resolution LED screens for presentations, videos, and visual entertainment.",
    features: ["4K displays", "Custom content", "Live streaming", "Interactive displays"],
  },
  {
    icon: Mic,
    title: "Sound Systems",
    description: "Crystal-clear audio systems tailored to your venue size and requirements.",
    features: ["Wireless microphones", "Line array speakers", "Mixing consoles", "Audio recording"],
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description: "Capture every precious moment with our professional photography and video services.",
    features: ["Event photography", "Drone videography", "Live streaming", "Same-day editing"],
  },
  {
    icon: Palette,
    title: "Event Decor",
    description: "Complete event styling and decoration to match your theme and vision.",
    features: ["Theme design", "Floral arrangements", "Backdrop setup", "Table styling"],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we provide comprehensive event services to make your
            occasion truly memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
