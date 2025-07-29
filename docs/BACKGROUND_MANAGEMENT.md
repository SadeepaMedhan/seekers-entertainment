# Background Management System

## Overview

The Background Management System allows you to dynamically manage background images and videos for different sections of your website through the admin panel. This system provides a complete solution for managing visual backgrounds with overlay controls, positioning, and media type support.

## Features

### 1. **Dynamic Background Support**
- Support for both images and videos as backgrounds
- Automatic fallback for video backgrounds
- Real-time background updates without page refresh

### 2. **Admin Panel Management**
- Easy-to-use interface for managing backgrounds
- Upload media directly or select from existing media library
- Live preview of settings
- Section-specific configuration

### 3. **Advanced Customization**
- Adjustable overlay opacity (0-100%)
- Customizable overlay colors
- Multiple positioning options
- Active/inactive toggle for each background

### 4. **Supported Sections**
- Hero Section
- Services Section
- Packages Section
- Gallery Section
- Testimonials Section
- Contact Section

## How to Use

### Accessing Background Management

1. Login to the admin panel at `/admin`
2. Navigate to the **"Backgrounds"** tab
3. Click **"Add Background"** to create a new background setting

### Adding a New Background

1. **Select Section**: Choose which website section you want to configure
2. **Choose Media Type**: Select either "Image" or "Video"
3. **Select Media**: 
   - Choose from uploaded media in your library, OR
   - Enter a custom URL for external media
4. **Configure Settings**:
   - **Position**: Set how the media is positioned (center, top, bottom, etc.)
   - **Overlay Color**: Choose the color of the overlay
   - **Overlay Opacity**: Adjust transparency (0% = transparent, 100% = opaque)
   - **Title & Description**: Optional metadata for organization
5. **Activate**: Toggle the background on/off
6. Click **"Create"** to save

### Editing Existing Backgrounds

1. Find the background you want to edit in the list
2. Click the **Edit** button (pencil icon)
3. Modify any settings in the form
4. Click **"Update"** to save changes

### Managing Background Status

- Use the **Eye/Eye-off** button to quickly enable/disable backgrounds
- Use the **Trash** button to permanently delete background settings

## Technical Implementation

### Components Used

- **`DynamicBackground`**: Wrapper component that applies backgrounds to sections
- **`BackgroundProvider`**: Context provider for background data management
- **`BackgroundManagement`**: Admin interface for managing backgrounds

### Database Schema

The system uses a MongoDB collection with the following structure:

```typescript
interface Background {
  section: string          // Section identifier (hero, services, etc.)
  mediaType: string       // 'image' or 'video'
  mediaUrl: string        // URL to the media file
  mediaId?: string        // Reference to uploaded media
  fallbackImageUrl?: string // Fallback for videos
  opacity: number         // Overlay opacity (0-1)
  overlayColor: string    // Hex color code
  position: string        // Positioning option
  isActive: boolean       // Whether background is active
  title?: string          // Optional title
  description?: string    // Optional description
}
```

### API Endpoints

- **GET** `/api/backgrounds` - Fetch all background settings
- **POST** `/api/backgrounds` - Create new background setting
- **PUT** `/api/backgrounds` - Update existing background setting
- **DELETE** `/api/backgrounds` - Delete background setting

## Integration with Existing Components

### Current Integration

The system is currently integrated with:
- **Hero Section**: Uses `DynamicBackground` component
- **Admin Panel**: Full management interface in the Backgrounds tab

### Adding to Other Sections

To add background management to other sections, wrap the section content with the `DynamicBackground` component:

```tsx
import { DynamicBackground } from '@/components/dynamic-background'

export function YourSection() {
  return (
    <DynamicBackground 
      section="services" 
      className="min-h-screen py-20"
    >
      {/* Your section content */}
      <div className="container mx-auto">
        <h2>Your Content</h2>
      </div>
    </DynamicBackground>
  )
}
```

## Best Practices

### Media Guidelines

1. **Images**: Use high-quality images (1920x1080 or higher)
2. **Videos**: Keep file sizes reasonable for web loading
3. **Formats**: Supported formats include JPG, PNG, WebP, MP4, WebM
4. **Fallbacks**: Always provide fallback images for video backgrounds

### Performance Considerations

1. **Optimization**: Compress images and videos before uploading
2. **Loading**: Hero section backgrounds load with priority
3. **Caching**: Media files are cached for better performance

### Design Guidelines

1. **Contrast**: Ensure text remains readable with overlay settings
2. **Consistency**: Use similar overlay settings across sections for cohesion
3. **Mobile**: Test backgrounds on different screen sizes
4. **Accessibility**: Ensure sufficient color contrast

## Troubleshooting

### Common Issues

1. **Background not showing**: Check if the background is marked as active
2. **Video not playing**: Ensure video format is supported and provide fallback image
3. **Poor performance**: Optimize media file sizes
4. **Text not readable**: Adjust overlay opacity and color

### Error Messages

- **"Failed to fetch backgrounds"**: Check database connection
- **"Background not found"**: Verify the background ID exists
- **"Unsupported file type"**: Use supported media formats

## Future Enhancements

Potential improvements for the system:

1. **Multiple Backgrounds**: Support for slideshow/carousel backgrounds
2. **Animations**: Background transitions and effects
3. **Responsive Images**: Different backgrounds for different screen sizes
4. **Scheduling**: Time-based background changes
5. **Templates**: Pre-configured background templates

## Support

For technical support or questions about the background management system, contact your development team or refer to the project documentation.
