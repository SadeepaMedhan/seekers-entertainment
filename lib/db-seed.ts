import connectDB from "./mongodb";
import { seedPackages, seedMedia, seedBackgrounds, seedInquiries } from "./seed-data";

// MongoDB Models (we'll import these from existing models)
let Package: any;
let Media: any; 
let Background: any;
let Inquiry: any;

// Dynamic imports to avoid issues in different environments
async function loadModels() {
  try {
    const mongoose = await import('mongoose');
    
    // Package Model
    const packageSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: String, required: true },
      features: [{ type: String }],
      category: { type: String, required: true },
      popular: { type: Boolean, default: false },
      availableFor: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    // Media Model
    const mediaSchema = new mongoose.Schema({
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      mimeType: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true },
      uploadDate: { type: Date, default: Date.now },
      category: { type: String }
    });

    // Background Model
    const backgroundSchema = new mongoose.Schema({
      section: { 
        type: String, 
        required: true,
        enum: ['hero', 'about', 'services', 'packages', 'gallery', 'testimonials', 'contact']
      },
      type: { 
        type: String, 
        required: true,
        enum: ['image', 'video']
      },
      url: { type: String, required: true },
      alt: { type: String },
      isActive: { type: Boolean, default: true },
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    // Inquiry Model
    const inquirySchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      eventType: { 
        type: String, 
        required: true,
        enum: ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Graduation', 'Festival', 'Other']
      },
      eventDate: { type: Date, required: true },
      message: { type: String, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'responded', 'completed'],
        default: 'pending'
      },
      submittedAt: { type: Date, default: Date.now }
    });

    // Get or create models
    Package = mongoose.models.Package || mongoose.model('Package', packageSchema);
    Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
    Background = mongoose.models.Background || mongoose.model('Background', backgroundSchema);
    Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

    return { Package, Media, Background, Inquiry };
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
}

export async function checkIfSeeded() {
  try {
    await connectDB();
    await loadModels();
    
    const packageCount = await Package.countDocuments();
    const mediaCount = await Media.countDocuments();
    const backgroundCount = await Background.countDocuments();
    
    // Consider database seeded if we have packages and backgrounds
    return packageCount > 0 && backgroundCount > 0;
  } catch (error) {
    console.error('Error checking if database is seeded:', error);
    return false;
  }
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await loadModels();

    // Check if already seeded
    const isSeeded = await checkIfSeeded();
    if (isSeeded) {
      console.log('✅ Database is already seeded, skipping...');
      return { success: true, message: 'Database already seeded' };
    }

    // Clear existing data (optional - be careful in production)
    const clearExisting = process.env.CLEAR_DB_ON_SEED === 'true';
    if (clearExisting) {
      console.log('🗑️ Clearing existing data...');
      await Package.deleteMany({});
      await Media.deleteMany({});
      await Background.deleteMany({});
      await Inquiry.deleteMany({});
    }

    // Seed Media first (backgrounds reference media)
    console.log('📸 Seeding media...');
    const createdMedia = await Media.insertMany(seedMedia);
    console.log(`✅ Created ${createdMedia.length} media items`);

    // Seed Packages
    console.log('📦 Seeding packages...');
    const createdPackages = await Package.insertMany(seedPackages);
    console.log(`✅ Created ${createdPackages.length} packages`);

    // Seed Backgrounds (link some to media)
    console.log('🖼️ Seeding backgrounds...');
    const backgroundsWithMedia = seedBackgrounds.map((bg: any, index: number) => {
      // Link first few backgrounds to created media
      if (index < createdMedia.length) {
        return { ...bg, mediaId: createdMedia[index]._id };
      }
      return bg;
    });
    const createdBackgrounds = await Background.insertMany(backgroundsWithMedia);
    console.log(`✅ Created ${createdBackgrounds.length} backgrounds`);

    // Seed Sample Inquiries
    console.log('✉️ Seeding sample inquiries...');
    const createdInquiries = await Inquiry.insertMany(seedInquiries);
    console.log(`✅ Created ${createdInquiries.length} inquiries`);

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        packages: createdPackages.length,
        media: createdMedia.length,
        backgrounds: createdBackgrounds.length,
        inquiries: createdInquiries.length
      }
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export async function seedDatabaseIfNeeded() {
  try {
    const isSeeded = await checkIfSeeded();
    if (!isSeeded) {
      console.log('🌱 Database not seeded, seeding now...');
      return await seedDatabase();
    } else {
      console.log('✅ Database already seeded');
      return { success: true, message: 'Database already seeded' };
    }
  } catch (error) {
    console.error('❌ Error in seedDatabaseIfNeeded:', error);
    throw error;
  }
}