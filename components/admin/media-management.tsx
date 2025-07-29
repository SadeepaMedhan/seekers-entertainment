"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { FileUpload } from '@/components/file-upload'
import { Plus, Edit, Trash2, Video, ImageIcon, Download, Filter, Grid, List, Search } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  category: string
  title: string
  description: string
  filename: string
  size: number
  mimeType: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt?: string
}

const categories = ['All', 'Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals']

export function MediaManagement() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchMedia()
  }, [])

  useEffect(() => {
    filterMedia()
  }, [media, categoryFilter, typeFilter, searchTerm])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterMedia = () => {
    let filtered = media

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMedia(filtered)
  }

  const handleEdit = (item: MediaItem) => {
    setSelectedMedia(item)
    setEditDialogOpen(true)
  }

  const handleUpdateMedia = async (formData: any) => {
    if (!selectedMedia) return

    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedMedia = await response.json()
        setMedia(media.map(item => 
          item.id === selectedMedia.id ? updatedMedia : item
        ))
        setEditDialogOpen(false)
        toast({
          title: "Success",
          description: "Media updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update media",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) {
      return
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setMedia(media.filter(item => item.id !== id))
        setSelectedItems(selectedItems.filter(itemId => itemId !== id))
        toast({
          title: "Success",
          description: "Media deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      return
    }

    try {
      const response = await fetch('/api/media/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      })

      if (response.ok) {
        setMedia(media.filter(item => !selectedItems.includes(item.id)))
        setSelectedItems([])
        toast({
          title: "Success",
          description: `${selectedItems.length} items deleted successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected items",
        variant: "destructive",
      })
    }
  }

  const handleBulkCategorize = async (category: string) => {
    if (selectedItems.length === 0) return

    try {
      const response = await fetch('/api/media/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems, category }),
      })

      if (response.ok) {
        const result = await response.json()
        setMedia(media.map(item => {
          if (selectedItems.includes(item.id)) {
            return { ...item, category }
          }
          return item
        }))
        setSelectedItems([])
        toast({
          title: "Success",
          description: `${selectedItems.length} items categorized successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to categorize selected items",
        variant: "destructive",
      })
    }
  }

  const handleUploadComplete = (uploadedFiles: any[]) => {
    fetchMedia()
    setUploadDialogOpen(false)
    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredMedia.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    return type === 'video' ? 
      <Video className="h-4 w-4 text-purple-500" /> : 
      <ImageIcon className="h-4 w-4 text-blue-500" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
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
            <CardTitle>Media Management</CardTitle>
            <CardDescription>
              Manage your images and videos for the gallery
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload New Media</DialogTitle>
                  <DialogDescription>
                    Upload images and videos for your gallery
                  </DialogDescription>
                </DialogHeader>
                <FileUpload 
                  onUploadComplete={handleUploadComplete}
                  onClose={() => setUploadDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters and Actions */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Select onValueChange={handleBulkCategorize}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk categorize" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.length > 0 && (
              <div className="col-span-full mb-4">
                <Checkbox
                  checked={selectedItems.length === filteredMedia.length}
                  onCheckedChange={handleSelectAll}
                  className="mr-2"
                />
                <span className="text-sm">Select All</span>
              </div>
            )}
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </div>
                  <div className="aspect-video relative">
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-400" />
                        <video
                          src={item.url}
                          className="absolute inset-0 w-full h-full object-cover"
                          controls={false}
                          muted
                          playsInline
                        />
                      </div>
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  
                  {item.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <div>{formatFileSize(item.size)}</div>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.length > 0 && (
              <div className="flex items-center gap-4 p-3 border-b">
                <Checkbox
                  checked={selectedItems.length === filteredMedia.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
            )}
            {filteredMedia.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                  
                  <div className="w-16 h-16 flex-shrink-0">
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      {getTypeIcon(item.type)}
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{item.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(item.size)}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {media.length === 0 ? 'No media files uploaded yet' : 'No media matches your filters'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {media.length === 0 
                ? 'Upload images and videos to get started' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {media.length === 0 && (
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Media</DialogTitle>
              <DialogDescription>Update media information</DialogDescription>
            </DialogHeader>
            
            {selectedMedia && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    defaultValue={selectedMedia.title}
                    onChange={(e) => {
                      if (selectedMedia) {
                        setSelectedMedia({ ...selectedMedia, title: e.target.value })
                      }
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    defaultValue={selectedMedia.description}
                    onChange={(e) => {
                      if (selectedMedia) {
                        setSelectedMedia({ ...selectedMedia, description: e.target.value })
                      }
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={selectedMedia.category}
                    onValueChange={(value) => {
                      if (selectedMedia) {
                        setSelectedMedia({ ...selectedMedia, category: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateMedia({
                      title: selectedMedia.title,
                      description: selectedMedia.description,
                      category: selectedMedia.category
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
