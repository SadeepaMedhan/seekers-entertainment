import { NextRequest, NextResponse } from 'next/server'
import { seedDatabaseIfNeeded } from '@/lib/db-seed'

export async function POST(request: NextRequest) {
  try {
    // Add basic security for manual seeding
    const authHeader = request.headers.get('authorization')
    const seedSecret = process.env.SEED_SECRET || 'default-seed-secret'
    
    if (authHeader !== `Bearer ${seedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await seedDatabaseIfNeeded()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Manual seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Auto-seed on GET for build-time seeding
export async function GET() {
  // Only auto-seed if explicitly enabled
  if (process.env.AUTO_SEED_DATABASE === 'true') {
    try {
      console.log('🌱 Auto-seeding enabled, checking database...')
      const result = await seedDatabaseIfNeeded()
      
      return NextResponse.json({
        message: 'Auto-seeding completed',
        ...result
      })
    } catch (error) {
      console.error('❌ Auto-seeding failed:', error)
      return NextResponse.json(
        { 
          error: 'Auto-seeding failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 500 }
      )
    }
  }
  
  return NextResponse.json({ 
    message: 'Auto-seeding disabled. Set AUTO_SEED_DATABASE=true to enable.' 
  })
}
