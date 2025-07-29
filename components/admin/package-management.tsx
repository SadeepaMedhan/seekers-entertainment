"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Star, DollarSign, Users, Clock } from 'lucide-react'

interface Package {
  id: string
  title: string
  description: string
  price: number
  features: string[]
  image: string
  popular: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

interface PackageFormData {
  title: string
  description: string
  price: number
  features: string[]
  image: string
  popular: boolean
  active: boolean
}

export function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<PackageFormData>({
    title: '',
    description: '',
    price: 0,
    features: [''],
    image: '/placeholder.svg?height=300&width=400',
    popular: false,
    active: true
  })
  const { toast } = useToast()

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
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features,
      image: pkg.image,
      popular: pkg.popular,
      active: pkg.active
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingPackage(null)
    setFormData({
      title: '',
      description: '',
      price: 0,
      features: [''],
      image: '/placeholder.svg?height=300&width=400',
      popular: false,
      active: true
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages'
      const method = editingPackage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        }),
      })

      if (response.ok) {
        const savedPackage = await response.json()
        
        if (editingPackage) {
          setPackages(packages.map(pkg => 
            pkg.id === editingPackage.id ? savedPackage : pkg
          ))
          toast({
            title: "Success",
            description: "Package updated successfully",
          })
        } else {
          setPackages([savedPackage, ...packages])
          toast({
            title: "Success",
            description: "Package created successfully",
          })
        }
        
        setIsDialogOpen(false)
      } else {
        throw new Error('Failed to save package')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return
    }

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPackages(packages.filter(pkg => pkg.id !== id))
        toast({
          title: "Success",
          description: "Package deleted successfully",
        })
      } else {
        throw new Error('Failed to delete package')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      })
    }
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Package Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Package Management</CardTitle>
            <CardDescription>
              Manage your service packages and pricing
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </DialogTitle>
                <DialogDescription>
                  {editingPackage ? 'Update package details' : 'Create a new service package'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Package Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Premium Wedding Package"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (LKR)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="50000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what's included in this package..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="/path/to/package-image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Package feature..."
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                    />
                    <Label htmlFor="popular" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Mark as Popular
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-48 object-cover"
                />
                {pkg.popular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {!pkg.active && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    Inactive
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{pkg.title}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(pkg.price)}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {pkg.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    {pkg.features.length} features included
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Created {new Date(pkg.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {packages.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No packages created yet</p>
            <p className="text-gray-400 text-sm mb-4">Create your first service package to get started</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
