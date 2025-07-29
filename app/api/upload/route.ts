import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// Supported file types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', // Some browsers might still send this
  'image/pjpeg', // Progressive JPEG
  'image/png', 
  'image/webp', 
  'image/gif'
]
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  return uploadDir
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  return `${baseName}_${timestamp}_${random}${extension}`
}

// Validate file type and size
function validateFile(file: File): { isValid: boolean; error?: string; type?: 'image' | 'video' } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` }
  }

  // Check file type
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: true, type: 'image' }
  } else if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return { isValid: true, type: 'video' }
  } else {
    return { 
      isValid: false, 
      error: `Unsupported file type. Supported types: ${[...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].join(', ')}` 
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    const formData = await request.formData()
    console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, typeof value]))
    
    const files = formData.getAll('files') as File[]
    console.log('Files array:', files.length, 'files found')
    
    if (!files || files.length === 0) {
      console.log('No files found in formData')
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadDir = await ensureUploadDir()
    const uploadedFiles = []

    for (const file of files) {
      // Debug: Log file information
      console.log('File upload attempt:', {
        name: file.name,
        type: file.type,
        size: file.size
      })
      
      // Validate file
      const validation = validateFile(file)
      if (!validation.isValid) {
        console.log('Validation failed:', validation.error)
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(file.name)
      const filePath = path.join(uploadDir, uniqueFilename)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Create file info object
      const fileInfo = {
        originalName: file.name,
        filename: uniqueFilename,
        url: `/uploads/${uniqueFilename}`,
        type: validation.type,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString()
      }

      uploadedFiles.push(fileInfo)
    }

    return NextResponse.json({ 
      message: "Files uploaded successfully",
      files: uploadedFiles 
    }, { status: 201 })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}

// Get upload statistics
export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ 
        totalFiles: 0,
        totalSize: 0,
        supportedTypes: {
          images: SUPPORTED_IMAGE_TYPES,
          videos: SUPPORTED_VIDEO_TYPES
        },
        maxFileSize: MAX_FILE_SIZE
      })
    }

    // In a real implementation, you'd scan the directory or query database
    return NextResponse.json({
      supportedTypes: {
        images: SUPPORTED_IMAGE_TYPES,
        videos: SUPPORTED_VIDEO_TYPES
      },
      maxFileSize: MAX_FILE_SIZE,
      maxFileSizeMB: MAX_FILE_SIZE / (1024 * 1024)
    })

  } catch (error) {
    console.error("Error getting upload info:", error)
    return NextResponse.json({ error: "Failed to get upload information" }, { status: 500 })
  }
}
