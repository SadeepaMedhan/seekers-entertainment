'use client'

import { useEffect } from 'react'

export function AutoSeeder() {
  useEffect(() => {
    // Only run in production and if auto-seeding is enabled
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_AUTO_SEED === 'true') {
      const seedDatabase = async () => {
        try {
          console.log('🌱 Checking if database needs seeding...')
          const response = await fetch('/api/seed', {
            method: 'GET',
          })
          
          if (response.ok) {
            const result = await response.json()
            console.log('✅ Auto-seeding result:', result)
          } else {
            console.warn('⚠️ Auto-seeding failed:', response.statusText)
          }
        } catch (error) {
          console.error('❌ Auto-seeding error:', error)
        }
      }

      // Run seeding check after a short delay
      const timer = setTimeout(seedDatabase, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  return null // This component doesn't render anything
}
