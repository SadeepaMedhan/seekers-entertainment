"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface MediaItem {
  id: string
  url: string
  type: "image" | "video"
  category: string
  title: string
  description?: string
}

const categories = ["All", "Weddings", "Corporate", "Parties", "Concerts", "Festivals"]

export function GallerySection() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch media from API
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media")
        if (response.ok) {
          const data = await response.json()
          setMediaItems(data)
          setFilteredItems(data)
        } else {
          // Fallback to default media
          setMediaItems(defaultMedia)
          setFilteredItems(defaultMedia)
        }
      } catch (error) {
        console.error("Error fetching media:", error)
        setMediaItems(defaultMedia)
        setFilteredItems(defaultMedia)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const defaultMedia: MediaItem[] = [
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

  const filterItems = (category: string) => {
    setActiveCategory(category)
    if (category === "All") {
      setFilteredItems(mediaItems)
    } else {
      setFilteredItems(mediaItems.filter((item) => item.category === category))
    }
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Work Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of successful events and see how we bring visions to life.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => filterItems(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                      <Badge className="mb-2 bg-primary">{item.category}</Badge>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-200">{item.description}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
