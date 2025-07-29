"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaItem {
  _id: string
  url: string
  type: 'image' | 'video'
  category: string
  title: string
  description: string
  filename: string
  size: number
  mimeType: string
  createdAt: string
}

const categories = ['All', 'Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals']

export function GallerySection() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredMedia(media)
    } else {
      setFilteredMedia(media.filter(item => item.category === selectedCategory))
    }
  }, [media, selectedCategory])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (item: MediaItem) => {
    const index = filteredMedia.findIndex(m => m._id === item._id)
    setCurrentIndex(index)
    setSelectedMedia(item)
  }

  const closeLightbox = () => {
    setSelectedMedia(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredMedia.length - 1
    setCurrentIndex(newIndex)
    setSelectedMedia(filteredMedia[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex < filteredMedia.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedMedia(filteredMedia[newIndex])
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of memorable events and celebrations
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of memorable events and celebrations
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card 
                key={item._id} 
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => openLightbox(item)}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-square relative overflow-hidden">
                    {item.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-purple-600">
                          Video
                        </Badge>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              {media.length === 0 
                ? 'No media files available yet' 
                : `No ${selectedCategory.toLowerCase()} media found`
              }
            </p>
            <p className="text-gray-400 text-sm">
              {media.length === 0 
                ? 'Check back soon for our latest work!' 
                : 'Try selecting a different category'
              }
            </p>
          </div>
        )}

        {/* Lightbox */}
        <Dialog open={!!selectedMedia} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black">
            {selectedMedia && (
              <div className="relative w-full h-full">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={closeLightbox}
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Navigation Buttons */}
                {filteredMedia.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}

                {/* Media Content */}
                <div className="flex items-center justify-center min-h-[60vh] p-4">
                  {selectedMedia.type === 'video' ? (
                    <video
                      src={selectedMedia.url}
                      controls
                      autoPlay
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>

                {/* Media Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{selectedMedia.title}</h3>
                  {selectedMedia.description && (
                    <p className="text-sm text-gray-200 mb-2">{selectedMedia.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedMedia.category}</Badge>
                    <Badge variant="outline" className="text-white border-white/30">
                      {selectedMedia.type === 'video' ? 'Video' : 'Image'}
                    </Badge>
                    <span className="text-xs text-gray-300 ml-auto">
                      {currentIndex + 1} of {filteredMedia.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
