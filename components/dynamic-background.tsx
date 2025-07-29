"use client"

import React from 'react'
import Image from 'next/image'
import { useBackgroundBySection } from '@/components/background-provider'

interface DynamicBackgroundProps {
  section: string
  children: React.ReactNode
  className?: string
  fallbackImage?: string
}

export function DynamicBackground({ 
  section, 
  children, 
  className = '', 
  fallbackImage = '/placeholder.svg?height=1080&width=1920' 
}: DynamicBackgroundProps) {
  const { background, loading } = useBackgroundBySection(section)

  const getPositionClass = (position: string) => {
    const positionMap: { [key: string]: string } = {
      'center': 'object-center',
      'top': 'object-top',
      'bottom': 'object-bottom',
      'left': 'object-left',
      'right': 'object-right',
      'top-left': 'object-left-top',
      'top-right': 'object-right-top',
      'bottom-left': 'object-left-bottom',
      'bottom-right': 'object-right-bottom'
    }
    return positionMap[position] || 'object-center'
  }

  const backgroundUrl = background?.mediaUrl || fallbackImage
  const overlayStyle = background ? {
    backgroundColor: background.overlayColor,
    opacity: background.opacity
  } : { backgroundColor: '#000000', opacity: 0.5 }

  return (
    <div className={`relative ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!loading && background?.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className={`w-full h-full object-cover ${getPositionClass(background.position)}`}
              poster={background.fallbackImageUrl}
            >
              <source src={background.mediaUrl} type="video/mp4" />
              {/* Fallback to image if video fails */}
              <Image
                src={background.fallbackImageUrl || fallbackImage}
                alt="Background"
                fill
                className={`object-cover ${getPositionClass(background.position)}`}
                priority={section === 'hero'}
              />
            </video>
          </div>
        ) : (
          <Image
            src={backgroundUrl}
            alt="Background"
            fill
            className={`object-cover ${background ? getPositionClass(background.position) : 'object-center'}`}
            priority={section === 'hero'}
          />
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={overlayStyle}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
