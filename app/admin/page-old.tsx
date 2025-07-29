"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LogOut, Package, ImageIcon, MessageSquare, Plus, Edit, Trash2, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)
    if (!success) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@seekersentertainment.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  const { logout } = useAuth()
  const [stats, setStats] = useState({
    packages: 0,
    media: 0,
    inquiries: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.packages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Media Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.media}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="packages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            <PackageManagement />
          </TabsContent>

          <TabsContent value="media">
            <MediaManagement />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function PackageManagement() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePackage = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPackages(packages.filter((pkg: any) => pkg.id !== id))
        toast({
          title: "Package deleted",
          description: "Package has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading packages...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Package Management</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{pkg.title}</h3>
                <p className="text-sm text-gray-600">{pkg.description}</p>
                <p className="text-lg font-bold text-primary">LKR.{pkg.price?.toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deletePackage(pkg.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MediaManagement() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/media")
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) {
      return
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setMedia(media.filter((item: any) => item.id !== id))
        toast({
          title: "Media deleted",
          description: "Media item has been successfully deleted.",
        })
      } else {
        throw new Error('Failed to delete media')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media item.",
        variant: "destructive",
      })
    }
  }

  const handleUploadComplete = (uploadedFiles: any[]) => {
    // Refresh media list
    fetchMedia()
    setUploadDialogOpen(false)
    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <div>Loading media...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Media Management</CardTitle>
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
              </DialogHeader>
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                onClose={() => setUploadDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item: any) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="relative aspect-video">
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
                    src={item.url || "/placeholder.svg"} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <div className="flex items-center gap-1">
                    {item.type === 'video' && (
                      <Video className="h-4 w-4 text-purple-500" />
                    )}
                    {item.type === 'image' && (
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                {item.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="text-xs text-gray-500 mb-3">
                  {item.size > 0 && <span>{formatFileSize(item.size)}</span>}
                  {item.createdAt && (
                    <span className="ml-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteMedia(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {media.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No media files uploaded yet</p>
            <p className="text-gray-400 text-sm">Click "Upload Media" to add images and videos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading inquiries...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <div key={inquiry.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{inquiry.name}</h3>
                <Badge variant="outline">{inquiry.eventType || "General"}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {inquiry.email} • {inquiry.phone}
              </p>
              {inquiry.eventDate && <p className="text-sm text-gray-600 mb-2">Event Date: {inquiry.eventDate}</p>}
              <p className="text-sm">{inquiry.message}</p>
              <p className="text-xs text-gray-500 mt-2">Received: {new Date(inquiry.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return isAuthenticated ? <AdminDashboard /> : <LoginForm />
}
