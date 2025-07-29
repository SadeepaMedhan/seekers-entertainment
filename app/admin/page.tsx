"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PackageManagement } from '@/components/admin/package-management'
import { InquiryManagement } from '@/components/admin/inquiry-management'
import { MediaManagement } from '@/components/admin/media-management'
import { BackgroundManagement } from '@/components/admin/background-management'
import { LogOut, Users, Package, MessageSquare, Image, Video, TrendingUp, Calendar, Star, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)
    if (!success) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
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
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

interface DashboardStats {
  totalInquiries: number
  totalPackages: number
  totalMedia: number
  totalImages: number
  totalVideos: number
  pendingInquiries: number
  confirmedBookings: number
  monthlyInquiries: number
}

function AdminDashboard() {
  const { logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalPackages: 0,
    totalMedia: 0,
    totalImages: 0,
    totalVideos: 0,
    pendingInquiries: 0,
    confirmedBookings: 0,
    monthlyInquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total Inquiries",
      value: stats.totalInquiries,
      description: "Total customer inquiries",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Packages",
      value: stats.totalPackages,
      description: "Available service packages",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Media Files",
      value: stats.totalMedia,
      description: `${stats.totalImages} images, ${stats.totalVideos} videos`,
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pending Inquiries",
      value: stats.pendingInquiries,
      description: "Awaiting response",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmedBookings,
      description: "This month",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Monthly Growth",
      value: `+${stats.monthlyInquiries}`,
      description: "New inquiries this month",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your entertainment services and customer inquiries
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="inquiries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inquiries" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Inquiries
            {stats.pendingInquiries > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {stats.pendingInquiries}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Backgrounds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries">
          <InquiryManagement />
        </TabsContent>

        <TabsContent value="packages">
          <PackageManagement />
        </TabsContent>

        <TabsContent value="media">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="backgrounds">
          <BackgroundManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <AdminDashboard />
}
