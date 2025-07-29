"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Clock, Users, Music, Camera, Mic } from 'lucide-react'
import Link from 'next/link'

interface Package {
  _id: string
  name: string
  price: number
  description: string
  features: string[]
  category: string
  popular: boolean
  duration?: string
  capacity?: string
  equipment?: string[]
  createdAt: string
}

const categoryIcons = {
  wedding: { icon: Star, color: 'text-pink-600', bg: 'bg-pink-50' },
  corporate: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  party: { icon: Music, color: 'text-purple-600', bg: 'bg-purple-50' },
  concert: { icon: Mic, color: 'text-red-600', bg: 'bg-red-50' },
  festival: { icon: Camera, color: 'text-green-600', bg: 'bg-green-50' },
  default: { icon: Star, color: 'text-gray-600', bg: 'bg-gray-50' }
}

export function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory)

  const categories = ['all', ...new Set(packages.map(pkg => pkg.category))]

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default
  }

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive entertainment packages designed for every occasion
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
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive entertainment packages designed for every occasion
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 capitalize"
                size="sm"
              >
                {category === 'all' ? 'All Packages' : category}
              </Button>
            ))}
          </div>
        )}

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => {
              const categoryInfo = getCategoryIcon(pkg.category)
              const IconComponent = categoryInfo.icon
              
              return (
                <Card 
                  key={pkg._id} 
                  className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    pkg.popular ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex p-3 rounded-full ${categoryInfo.bg} mx-auto mb-4`}>
                      <IconComponent className={`h-6 w-6 ${categoryInfo.color}`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {pkg.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">
                        ${pkg.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2">per event</span>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className="mt-3 capitalize"
                    >
                      {pkg.category}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Features Included:</h4>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Additional Info */}
                      {(pkg.duration || pkg.capacity || pkg.equipment) && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                            {pkg.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Duration: {pkg.duration}</span>
                              </div>
                            )}
                            {pkg.capacity && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Capacity: {pkg.capacity}</span>
                              </div>
                            )}
                            {pkg.equipment && pkg.equipment.length > 0 && (
                              <div className="flex items-start gap-2">
                                <Camera className="h-4 w-4 mt-0.5" />
                                <span>Equipment: {pkg.equipment.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-6">
                    <Link href="#contact" className="w-full">
                      <Button 
                        className="w-full" 
                        size="lg"
                        variant={pkg.popular ? "default" : "outline"}
                      >
                        Get Quote
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">
              {packages.length === 0 
                ? 'No packages available yet' 
                : `No ${selectedCategory} packages found`
              }
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {packages.length === 0 
                ? 'Check back soon for our service packages!' 
                : 'Try selecting a different category or contact us for custom packages'
              }
            </p>
            <Link href="#contact">
              <Button>
                Contact Us for Custom Packages
              </Button>
            </Link>
          </div>
        )}
        
        {/* Call to Action */}
        {filteredPackages.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-gray-50 rounded-2xl px-8 py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Custom Package?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find exactly what you're looking for? We create custom entertainment 
                packages tailored to your specific event needs and budget.
              </p>
              <Link href="#contact">
                <Button size="lg" className="px-8">
                  Get Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
