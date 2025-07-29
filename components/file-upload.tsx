"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, FileImage, FileVideo, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete?: (files: any[]) => void
  onClose?: () => void
}

interface UploadFile {
  originalFile: File
  id: string
  name: string
  size: number
  type: string
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

const categories = ['Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals']

export function FileUpload({ onUploadComplete, onClose }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).map(file => ({
      originalFile: file, // Store the original File object
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const updateFileMetadata = (fileId: string, metadata: { title?: string, description?: string, category?: string }) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, ...metadata }
        : file
    ))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    const uploadedFiles = []

    try {
      for (const file of files) {
        if (file.status === 'success') continue

        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ))

        const formData = new FormData()
        formData.append('files', file.originalFile)

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const result = await response.json()
          const uploadedFile = result.files[0]

          // Update progress to complete
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'success', progress: 100 }
              : f
          ))

          // Create media entry
          const mediaData = {
            url: uploadedFile.url,
            type: uploadedFile.type,
            title: (file as any).title || (file.name ? file.name.replace(/\.[^/.]+$/, "") : "Untitled"),
            description: (file as any).description || '',
            category: (file as any).category || 'Weddings',
            filename: uploadedFile.filename,
            size: uploadedFile.size,
            mimeType: uploadedFile.mimeType
          }

          const mediaResponse = await fetch('/api/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mediaData),
          })

          if (mediaResponse.ok) {
            const mediaItem = await mediaResponse.json()
            uploadedFiles.push(mediaItem)
          }

        } catch (error) {
          console.error('Upload error:', error)
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          ))
          
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name || 'file'}`,
            variant: "destructive",
          })
        }
      }

      if (uploadedFiles.length > 0) {
        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        })
        
        onUploadComplete?.(uploadedFiles)
      }

    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-8 w-8 text-purple-500" />
    }
    return <FileImage className="h-8 w-8 text-gray-500" />
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upload Media Files</CardTitle>
            <CardDescription>
              Upload images and videos for your gallery. Supported formats: JPG, PNG, WebP, MP4, WebM
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 50MB per file
          </p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" className="mt-4" asChild>
              <span>Browse Files</span>
            </Button>
          </Label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Files to Upload ({files.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name || 'Preview'}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.originalFile)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium truncate">{file.name || 'Unnamed file'}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'uploading'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* File Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor={`title-${file.id}`} className="text-xs">Title</Label>
                          <Input
                            id={`title-${file.id}`}
                            placeholder="Enter title"
                            defaultValue={file.name ? file.name.replace(/\.[^/.]+$/, "") : ""}
                            onChange={(e) => updateFileMetadata(file.id, { title: e.target.value })}
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`category-${file.id}`} className="text-xs">Category</Label>
                          <Select
                            defaultValue="Weddings"
                            onValueChange={(value) => updateFileMetadata(file.id, { category: value })}
                            disabled={file.status === 'uploading'}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`description-${file.id}`} className="text-xs">Description</Label>
                          <Input
                            id={`description-${file.id}`}
                            placeholder="Enter description"
                            onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                      </div>

                      {/* Progress and Status */}
                      {file.status === 'uploading' && (
                        <div className="space-y-2">
                          <Progress value={file.progress} />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      )}
                      {file.status === 'success' && (
                        <p className="text-sm text-green-600">✓ Upload successful</p>
                      )}
                      {file.status === 'error' && (
                        <p className="text-sm text-red-600">✗ {file.error || 'Upload failed'}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Clear All
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.status === 'success')}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
