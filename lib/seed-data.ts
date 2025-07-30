// Seed data for automatic database population
export const seedPackages = [
  {
    name: "Wedding Complete Package",
    description: "Complete wedding entertainment package with DJ, sound system, lighting, and photography coverage for your special day.",
    price: 150000,
    duration: "Full Day (12 hours)",
    features: [
      "Professional DJ with premium sound system",
      "Wedding lighting setup with uplighting",
      "Wireless microphones for ceremonies",
      "Background music for dinner",
      "Dance floor lighting",
      "Photography coverage (4 hours)",
      "MC services for announcements",
      "Setup and breakdown included"
    ],
    category: "wedding",
    popular: true,
    availableFor: ["Wedding", "Reception"]
  },
  {
    name: "Birthday Party Deluxe",
    description: "Premium birthday party package with entertainment, decorations, and audio-visual equipment for an unforgettable celebration.",
    price: 75000,
    duration: "6 hours",
    features: [
      "DJ with birthday playlist",
      "Party lighting system",
      "Microphone for speeches",
      "Balloon decorations",
      "Party games coordination",
      "Photo booth setup",
      "Sound system rental",
      "Event coordination"
    ],
    category: "birthday",
    popular: true,
    availableFor: ["Birthday", "Anniversary"]
  },
  {
    name: "Corporate Event Premium",
    description: "Professional corporate event package with AV equipment, presentation support, and entertainment services.",
    price: 200000,
    duration: "8 hours",
    features: [
      "Professional AV equipment",
      "Presentation screen and projector",
      "Wireless microphones",
      "Professional DJ for networking",
      "Stage lighting setup",
      "Technical support staff",
      "Live streaming capability",
      "Event coordination services"
    ],
    category: "corporate",
    popular: false,
    availableFor: ["Corporate", "Conference"]
  },
  {
    name: "Anniversary Celebration",
    description: "Romantic anniversary package with elegant lighting, music, and photography to celebrate your love story.",
    price: 85000,
    duration: "5 hours",
    features: [
      "Romantic lighting setup",
      "Curated music playlist",
      "Photography coverage (2 hours)",
      "Decorative arrangements",
      "Wireless microphones",
      "Sound system rental",
      "Setup and cleanup",
      "Personal coordinator"
    ],
    category: "anniversary",
    popular: false,
    availableFor: ["Anniversary", "Engagement"]
  },
  {
    name: "Graduation Party Special",
    description: "Celebrate your achievement with our graduation party package featuring music, lighting, and entertainment.",
    price: 60000,
    duration: "4 hours",
    features: [
      "DJ with graduation playlist",
      "Colorful party lighting",
      "Microphone for speeches",
      "Photo backdrop setup",
      "Sound system rental",
      "Party coordination",
      "Graduate recognition ceremony",
      "Music request system"
    ],
    category: "graduation",
    popular: false,
    availableFor: ["Graduation", "Achievement"]
  },
  {
    name: "Festival Event Mega",
    description: "Large-scale festival package with professional stage setup, lighting, and entertainment coordination.",
    price: 500000,
    duration: "Full Day (16 hours)",
    features: [
      "Professional stage setup",
      "Concert-grade sound system",
      "Professional lighting rig",
      "Multiple microphones",
      "Live performance coordination",
      "Crowd management support",
      "Security coordination",
      "Technical crew included",
      "Generator backup power",
      "Event insurance coverage"
    ],
    category: "festival",
    popular: true,
    availableFor: ["Festival", "Concert", "Community Event"]
  }
];

export const seedMedia = [
  {
    filename: "wedding-setup-1.jpg",
    originalName: "wedding-setup-1.jpg",
    mimeType: "image/jpeg",
    size: 245760,
    url: "/placeholder.jpg",
    uploadDate: new Date(),
    category: "wedding"
  },
  {
    filename: "birthday-party-lights.jpg",
    originalName: "birthday-party-lights.jpg",
    mimeType: "image/jpeg",
    size: 198432,
    url: "/placeholder.jpg",
    uploadDate: new Date(),
    category: "birthday"
  },
  {
    filename: "corporate-event-setup.jpg",
    originalName: "corporate-event-setup.jpg",
    mimeType: "image/jpeg",
    size: 312567,
    url: "/placeholder.jpg",
    uploadDate: new Date(),
    category: "corporate"
  },
  {
    filename: "festival-stage.jpg",
    originalName: "festival-stage.jpg",
    mimeType: "image/jpeg",
    size: 467123,
    url: "/placeholder.jpg",
    uploadDate: new Date(),
    category: "festival"
  },
  {
    filename: "anniversary-decoration.jpg",
    originalName: "anniversary-decoration.jpg",
    mimeType: "image/jpeg",
    size: 189456,
    url: "/placeholder.jpg",
    uploadDate: new Date(),
    category: "anniversary"
  }
];

export const seedBackgrounds = [
  {
    section: "hero",
    type: "image",
    url: "/placeholder.jpg",
    alt: "Hero section background",
    isActive: true,
    mediaId: null // Will be populated during seeding
  },
  {
    section: "about",
    type: "image",
    url: "/placeholder.jpg",
    alt: "About section background",
    isActive: true,
    mediaId: null
  },
  {
    section: "services",
    type: "image", 
    url: "/placeholder.jpg",
    alt: "Services section background",
    isActive: true,
    mediaId: null
  },
  {
    section: "packages",
    type: "image",
    url: "/placeholder.jpg", 
    alt: "Packages section background",
    isActive: true,
    mediaId: null
  },
  {
    section: "gallery",
    type: "image",
    url: "/placeholder.jpg",
    alt: "Gallery section background", 
    isActive: true,
    mediaId: null
  },
  {
    section: "testimonials",
    type: "image",
    url: "/placeholder.jpg",
    alt: "Testimonials section background",
    isActive: true,
    mediaId: null
  },
  {
    section: "contact",
    type: "image",
    url: "/placeholder.jpg",
    alt: "Contact section background",
    isActive: true,
    mediaId: null
  }
];

export const seedInquiries = [
  {
    name: "John & Sarah Wedding",
    email: "john.sarah@example.com",
    phone: "+1234567890",
    eventType: "Wedding",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    message: "We're planning our dream wedding and would love to discuss your wedding package options. We expect around 150 guests.",
    status: "pending",
    submittedAt: new Date()
  },
  {
    name: "Corporate Events Ltd",
    email: "events@corporate.com",
    phone: "+1234567891",
    eventType: "Corporate",
    eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    message: "Looking for professional AV setup for our annual conference. Need presentation equipment and networking entertainment.",
    status: "pending",
    submittedAt: new Date()
  },
  {
    name: "Birthday Party Celebration",
    email: "party@celebration.com", 
    phone: "+1234567892",
    eventType: "Birthday",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    message: "Planning a surprise 30th birthday party. Need DJ, lighting, and decoration services for about 50 people.",
    status: "responded",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];