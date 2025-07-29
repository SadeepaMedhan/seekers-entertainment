"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { MessageSquare, Mail, Phone, Calendar, User, Edit, Trash2, Eye, Filter } from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string | null
  message: string
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'completed'
  notes: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  quoted: 'bg-purple-500',
  booked: 'bg-green-500',
  completed: 'bg-gray-500'
}

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  booked: 'Booked',
  completed: 'Completed'
}

export function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiries, statusFilter, searchTerm])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterInquiries = () => {
    let filtered = inquiries

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredInquiries(filtered)
  }

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes)
    setIsEditDialogOpen(true)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updatedInquiry = await response.json()
        setInquiries(inquiries.map(inquiry =>
          inquiry.id === id ? updatedInquiry : inquiry
        ))
        toast({
          title: "Success",
          description: "Status updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleNotesUpdate = async () => {
    if (!selectedInquiry) return

    try {
      const response = await fetch(`/api/contact/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        const updatedInquiry = await response.json()
        setInquiries(inquiries.map(inquiry =>
          inquiry.id === selectedInquiry.id ? updatedInquiry : inquiry
        ))
        setIsEditDialogOpen(false)
        toast({
          title: "Success",
          description: "Notes updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) {
      return
    }

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id))
        toast({
          title: "Success",
          description: "Inquiry deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      })
    }
  }

  const getStatusCount = (status: string) => {
    return inquiries.filter(inquiry => inquiry.status === status).length
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Inquiries</CardTitle>
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
        <CardTitle>Contact Inquiries</CardTitle>
        <CardDescription>
          Manage customer inquiries and track follow-ups
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
          {Object.entries(statusLabels).map(([status, label]) => (
            <Card key={status} className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xl font-bold">{getStatusCount(status)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusLabels).map(([status, label]) => (
                <SelectItem key={status} value={status}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                    <Badge 
                      className={`${statusColors[inquiry.status]} text-white`}
                    >
                      {statusLabels[inquiry.status]}
                    </Badge>
                    <Badge variant="outline">{inquiry.eventType}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {inquiry.phone}
                    </div>
                    {inquiry.eventDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(inquiry.eventDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {inquiry.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Received: {new Date(inquiry.createdAt).toLocaleString()}</span>
                    {inquiry.notes && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Has notes
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) => handleStatusUpdate(inquiry.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([status, label]) => (
                        <SelectItem key={status} value={status}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(inquiry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(inquiry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(inquiry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
            </p>
            <p className="text-gray-400 text-sm">
              {inquiries.length === 0 
                ? 'Customer inquiries will appear here' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>Full inquiry information</DialogDescription>
            </DialogHeader>
            
            {selectedInquiry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="mt-1 font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={`mt-1 ${statusColors[selectedInquiry.status]} text-white`}>
                      {statusLabels[selectedInquiry.status]}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="mt-1">{selectedInquiry.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <p className="mt-1">{selectedInquiry.eventType}</p>
                  </div>
                  {selectedInquiry.eventDate && (
                    <div>
                      <Label>Event Date</Label>
                      <p className="mt-1">{new Date(selectedInquiry.eventDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Message</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedInquiry.message}</p>
                </div>
                
                {selectedInquiry.notes && (
                  <div>
                    <Label>Internal Notes</Label>
                    <p className="mt-1 p-3 bg-blue-50 rounded-md">{selectedInquiry.notes}</p>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                  {selectedInquiry.updatedAt !== selectedInquiry.createdAt && (
                    <span className="ml-4">
                      Updated: {new Date(selectedInquiry.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Notes Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notes</DialogTitle>
              <DialogDescription>Add or update internal notes for this inquiry</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this inquiry..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleNotesUpdate}>
                  Save Notes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
