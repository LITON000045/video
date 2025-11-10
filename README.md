# Video Editor Portfolio Website

A professional, responsive portfolio website for video editors to showcase their work. Built with static HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

## 🎬 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **YouTube Integration**: Embed videos directly from YouTube with custom controls
- **Project Filtering**: Filter projects by category (wedding, commercial, music-video, etc.)
- **Search Functionality**: Search projects by title, description, client, or tags
- **Featured Projects**: Highlight your best work on the homepage
- **Project Modal**: Detailed video viewing with navigation between projects
- **Contact Form**: Professional contact form for client inquiries
- **SEO Optimized**: Meta tags and structured data for search engines
- **Performance Optimized**: Lazy loading, minified assets, and fast loading times
- **GitHub Pages Ready**: Deploy with a single click to GitHub Pages

## 🚀 Quick Start

### Prerequisites
- A GitHub account
- Your videos uploaded to YouTube (public or unlisted)

### Step 1: Upload Videos to YouTube
1. Upload your portfolio videos to YouTube
2. Set videos as "Public" or "Unlisted"
3. Copy the YouTube video IDs (the part after `youtube.com/watch?v=`)

### Step 2: Update Your Portfolio Data
Edit `data/projects.json` to add your projects:

```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "title": "Your Project Title",
      "description": "Brief description of your project",
      "youtubeId": "your-youtube-video-id",
      "thumbnail": "thumbnails/your-image.jpg",
      "tags": ["wedding", "cinematic"],
      "featured": true,
      "client": "Client Name (optional)",
      "year": "2024",
      "duration": "3:45"
    }
  ],
  "featuredOrder": ["project-id-1", "project-id-2"],
  "settings": {
    "siteTitle": "Your Name - Video Editor",
    "siteDescription": "Professional video editing services",
    "contactEmail": "hello@yourname.com",
    "contactPhone": "+1 (555) 123-4567",
    "socialLinks": {
      "youtube": "https://youtube.com/yourchannel",
      "instagram": "https://instagram.com/yourprofile",
      "linkedin": "https://linkedin.com/in/yourprofile"
    }
  }
}
```

### Step 3: Add Your Thumbnails
1. Create thumbnail images for each project (recommended size: 800x600px)
2. Save them in the `images/thumbnails/` folder
3. Update the `thumbnail` field in `projects.json` with your image filenames

### Step 4: Customize Your Site
Edit the following files to personalize your portfolio:

#### `index.html`
- Update your name in the header and hero section
- Modify the about section content
- Update contact information
- Add your social media links

#### `css/style.css`
- Adjust colors, fonts, and styling
- Customize the design to match your brand

#### `data/projects.json`
- Update all settings in the `settings` object
- Add your contact information and social links

### Step 5: Deploy to GitHub Pages
1. Push your changes to the main branch
2. Go to your repository settings on GitHub
3. Scroll down to "Pages" section
4. Under "Build and deployment", select "Deploy from a branch"
5. Choose "main" branch and "/root" folder
6. Click "Save"
7. Your site will be live at `https://yourusername.github.io/video/`

## 📁 Project Structure

```
video/
├── index.html              # Main portfolio page
├── css/
│   ├── style.css          # Main stylesheet
│   ├── responsive.css     # Mobile responsive styles
│   └── thumbnails.css     # Thumbnail placeholder styles
├── js/
│   ├── main.js            # Core functionality
│   ├── portfolio.js       # Portfolio logic and filtering
│   └── video-player.js    # YouTube player integration
├── images/
│   ├── thumbnails/        # Add your project thumbnails here
│   └── assets/           # Logos, icons, other images
├── data/
│   └── projects.json     # Project data and settings
└── README.md             # This file
```

## 🎨 Customization Guide

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #667eea;
    --text-color: #333;
    --background-color: #fff;
}
```

### Fonts
The site uses Google Fonts (Inter and Playfair Display). You can change the fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

### Adding New Projects
1. Upload video to YouTube
2. Create thumbnail image
3. Add entry to `data/projects.json`
4. Add thumbnail to `images/thumbnails/`
5. Commit and push changes

### Project Categories (Tags)
Common tags used in the portfolio:
- `wedding` - Wedding videos and highlights
- `commercial` - Business and promotional content
- `music-video` - Music videos and artistic projects
- `event` - Event coverage and live events
- `social-media` - Short-form content for social platforms
- `documentary` - Documentary and storytelling content
- `corporate` - Corporate videos and training content

You can create custom tags for your specific niche.

## 🔧 Advanced Features

### Google Analytics
Add your Google Analytics ID to `data/projects.json`:
```json
"settings": {
  "analytics": {
    "googleAnalyticsId": "GA-XXXXXXXXXX"
  }
}
```

### Custom Domain
1. Go to your repository settings on GitHub
2. Under "Pages", click "Add custom domain"
3. Enter your domain name
4. Update your DNS records as instructed by GitHub
5. SSL certificate will be automatically provisioned

### SEO Optimization
The site includes:
- Meta tags for social sharing
- Structured data for videos
- Semantic HTML5 structure
- Clean URLs with project IDs

### Performance
- Images are lazy loaded for faster initial page load
- CSS and JavaScript are optimized for performance
- YouTube videos only load when clicked

## 📱 Mobile Features

- Touch-friendly navigation
- Responsive video player
- Optimized for all screen sizes
- Gesture support for video controls

## 🐛 Troubleshooting

### Videos Not Playing
- Check YouTube video IDs are correct
- Ensure videos are public or unlisted
- Verify YouTube embed permissions

### Images Not Loading
- Check file paths in `projects.json`
- Ensure images are in the correct folder
- Verify image formats (JPG, PNG, WebP supported)

### Contact Form Not Working
- The form currently shows a success message but doesn't send emails
- To make it functional, you'll need to:
  1. Set up a backend service (Netlify Forms, Formspree, etc.)
  2. Update the form submission handler in `js/main.js`

### Deployment Issues
- Ensure your repository is public
- Check that GitHub Pages is enabled in settings
- Verify the branch and folder settings
- Check for any build errors in the GitHub Actions tab

## 🤝 Contributing

This is a template portfolio website. Feel free to:
- Customize the design
- Add new features
- Improve the code
- Fix bugs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help:
1. Check this README for common issues
2. Review the code comments for detailed explanations
3. Search for similar issues in the GitHub issues section
4. Create a new issue with detailed information about your problem

## 🔄 Updates

To keep your portfolio fresh:
- Add new projects regularly
- Update featured projects seasonally
- Refresh client testimonials
- Check YouTube video links periodically
- Update your contact information if it changes

---

**Happy showcasing! 🎥✨**