"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface BackgroundData {
  _id: string
  section: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  fallbackImageUrl?: string
  opacity: number
  overlayColor: string
  position: string
  isActive: boolean
  title?: string
  description?: string
}

interface BackgroundContextType {
  backgrounds: BackgroundData[]
  loading: boolean
  error: string | null
  refreshBackgrounds: () => Promise<void>
  getBackgroundBySection: (section: string) => BackgroundData | null
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

interface BackgroundProviderProps {
  children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [backgrounds, setBackgrounds] = useState<BackgroundData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBackgrounds = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/backgrounds')
      
      if (!response.ok) {
        throw new Error('Failed to fetch backgrounds')
      }
      
      const data = await response.json()
      setBackgrounds(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backgrounds')
      console.error('Error fetching backgrounds:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshBackgrounds = async () => {
    await fetchBackgrounds()
  }

  const getBackgroundBySection = (section: string): BackgroundData | null => {
    return backgrounds.find(bg => bg.section === section && bg.isActive) || null
  }

  useEffect(() => {
    fetchBackgrounds()
  }, [])

  const value: BackgroundContextType = {
    backgrounds,
    loading,
    error,
    refreshBackgrounds,
    getBackgroundBySection
  }

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackgrounds() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackgrounds must be used within a BackgroundProvider')
  }
  return context
}

// Hook for getting a specific section's background
export function useBackgroundBySection(section: string) {
  const { getBackgroundBySection, loading, error } = useBackgrounds()
  const [background, setBackground] = useState<BackgroundData | null>(null)

  useEffect(() => {
    if (!loading) {
      setBackground(getBackgroundBySection(section))
    }
  }, [section, getBackgroundBySection, loading])

  return { background, loading, error }
}
