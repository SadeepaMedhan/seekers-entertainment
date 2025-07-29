"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { 
  Image, 
  Video, 
  Settings, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Upload,
  Monitor,
  Palette,
  Move,
  Eye,
  EyeOff
} from 'lucide-react'

interface Background {
  _id: string
  section: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  mediaId?: string
  fallbackImageUrl?: string
  opacity: number
  overlayColor: string
  position: string
  isActive: boolean
  title?: string
  description?: string
  createdAt: string
  updatedAt: string
}

interface MediaItem {
  _id: string
  url: string
  title: string
  type: 'image' | 'video'
  filename: string
}

const sections = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'services', label: 'Services Section' },
  { value: 'packages', label: 'Packages Section' },
  { value: 'gallery', label: 'Gallery Section' },
  { value: 'testimonials', label: 'Testimonials Section' },
  { value: 'contact', label: 'Contact Section' }
]

const positions = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' }
]

export function BackgroundManagement() {
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    section: '',
    mediaType: 'image' as 'image' | 'video',
    mediaUrl: '',
    mediaId: '',
    fallbackImageUrl: '',
    opacity: 0.5,
    overlayColor: '#000000',
    position: 'center',
    title: '',
    description: '',
    isActive: true
  })

  useEffect(() => {
    fetchBackgrounds()
    fetchMediaItems()
  }, [])

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch('/api/backgrounds')
      if (response.ok) {
        const data = await response.json()
        setBackgrounds(data)
      }
    } catch (error) {
      console.error('Failed to fetch backgrounds:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch background settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch media items:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedMedia = mediaItems.find(item => item._id === formData.mediaId)
      const payload = {
        ...formData,
        mediaUrl: selectedMedia ? selectedMedia.url : formData.mediaUrl,
        mediaType: selectedMedia ? selectedMedia.type : formData.mediaType
      }

      const url = editingId ? '/api/backgrounds' : '/api/backgrounds'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Background ${editingId ? 'updated' : 'created'} successfully`,
        })
        resetForm()
        fetchBackgrounds()
      } else {
        throw new Error('Failed to save background')
      }
    } catch (error) {
      console.error('Error saving background:', error)
      toast({
        title: 'Error',
        description: 'Failed to save background settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (background: Background) => {
    setFormData({
      section: background.section,
      mediaType: background.mediaType,
      mediaUrl: background.mediaUrl,
      mediaId: background.mediaId || '',
      fallbackImageUrl: background.fallbackImageUrl || '',
      opacity: background.opacity,
      overlayColor: background.overlayColor,
      position: background.position,
      title: background.title || '',
      description: background.description || '',
      isActive: background.isActive
    })
    setEditingId(background._id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this background setting?')) return

    try {
      const response = await fetch(`/api/backgrounds?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Background setting deleted successfully',
        })
        fetchBackgrounds()
      } else {
        throw new Error('Failed to delete background')
      }
    } catch (error) {
      console.error('Error deleting background:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete background setting',
        variant: 'destructive',
      })
    }
  }

  const toggleActive = async (background: Background) => {
    try {
      const response = await fetch('/api/backgrounds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: background._id,
          isActive: !background.isActive
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Background ${!background.isActive ? 'enabled' : 'disabled'}`,
        })
        fetchBackgrounds()
      }
    } catch (error) {
      console.error('Error toggling background:', error)
      toast({
        title: 'Error',
        description: 'Failed to update background status',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      section: '',
      mediaType: 'image',
      mediaUrl: '',
      mediaId: '',
      fallbackImageUrl: '',
      opacity: 0.5,
      overlayColor: '#000000',
      position: 'center',
      title: '',
      description: '',
      isActive: true
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const getSectionName = (section: string) => {
    return sections.find(s => s.value === section)?.label || section
  }

  const getPositionName = (position: string) => {
    return positions.find(p => p.value === position)?.label || position
  }

  if (loading && backgrounds.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Background Management</h2>
          <p className="text-muted-foreground">
            Manage background images and videos for different sections of your website
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Add Background
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Background' : 'Add New Background'}</CardTitle>
            <CardDescription>
              Configure background media for a specific section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                    disabled={!!editingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mediaType">Media Type</Label>
                  <Select
                    value={formData.mediaType}
                    onValueChange={(value: 'image' | 'video') => setFormData(prev => ({ ...prev, mediaType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Select from Uploaded Media</Label>
                <Select
                  value={formData.mediaId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, mediaId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose from uploaded media" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaItems
                      .filter(item => formData.mediaType === 'image' ? item.type === 'image' : item.type === 'video')
                      .map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.title || item.filename}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mediaUrl">Or Enter Custom URL</Label>
                <Input
                  id="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.mediaType === 'video' && (
                <div>
                  <Label htmlFor="fallbackImageUrl">Fallback Image URL</Label>
                  <Input
                    id="fallbackImageUrl"
                    value={formData.fallbackImageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, fallbackImageUrl: e.target.value }))}
                    placeholder="Fallback image for video background"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="overlayColor">Overlay Color</Label>
                  <Input
                    id="overlayColor"
                    type="color"
                    value={formData.overlayColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Overlay Opacity: {Math.round(formData.opacity * 100)}%</Label>
                <Slider
                  value={[formData.opacity]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, opacity: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Background title"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Background description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Background List */}
      <div className="grid gap-4">
        {backgrounds.map((background) => (
          <Card key={background._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {background.mediaType === 'image' ? (
                        <Image className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Video className="h-5 w-5 text-purple-500" />
                      )}
                      <h3 className="font-semibold">{getSectionName(background.section)}</h3>
                    </div>
                    <Badge variant={background.isActive ? 'default' : 'secondary'}>
                      {background.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {background.mediaType}
                    </Badge>
                  </div>

                  {background.title && (
                    <p className="text-sm font-medium text-gray-700 mb-1">{background.title}</p>
                  )}

                  {background.description && (
                    <p className="text-sm text-gray-600 mb-3">{background.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="flex items-center gap-1">
                        <Move className="h-3 w-3" />
                        Position: {getPositionName(background.position)}
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        Opacity: {Math.round(background.opacity * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        Overlay: 
                        <div 
                          className="w-4 h-4 rounded border ml-1" 
                          style={{ backgroundColor: background.overlayColor }}
                        />
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(background.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {background.mediaUrl && (
                    <div className="mt-3">
                      {background.mediaType === 'image' ? (
                        <img
                          src={background.mediaUrl}
                          alt={background.title || 'Background'}
                          className="w-32 h-20 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(background)}
                  >
                    {background.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(background)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(background._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {backgrounds.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No background settings</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding background media for your website sections.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Add First Background
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
