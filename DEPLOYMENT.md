# Deployment Guide

## GitHub Pages Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Create GitHub Workflow Directory**
   ```bash
   mkdir -p .github/workflows
   ```

2. **Add Workflow File**
   - Copy `deploy.yml` to `.github/workflows/deploy.yml`
   - Commit and push to your repository

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Source: Select "GitHub Actions"

Your site will automatically deploy whenever you push to the main branch.

### Option 2: Manual Deployment

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Source: Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/root`
   - Click Save

2. **Manual Deployment**
   - Push changes to main branch
   - GitHub will automatically build and deploy
   - Site will be available at `https://username.github.io/video/`

## Alternative Deployment Platforms

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to `echo "No build needed"`
3. Set publish directory to `.` (root)
4. Deploy automatically on push to main

### Vercel
1. Connect your GitHub repository to Vercel
2. Framework Preset: Other
3. Build Settings: Leave empty (static site)
4. Deploy automatically

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

## Custom Domain Setup

### GitHub Pages Custom Domain
1. Go to repository Settings → Pages
2. Click "Add custom domain"
3. Enter your domain (e.g., `yourportfolio.com`)
4. Configure DNS records:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME record: `www` to `username.github.io`

### DNS Configuration Example
```
Type    Name        Value
A       @           185.199.108.153
A       @           185.199.109.153
A       @           185.199.110.153
A       @           185.199.111.153
CNAME   www         username.github.io
```

## SSL Certificate

- GitHub Pages provides automatic SSL certificates
- Certificate may take a few minutes to provision
- HTTPS will be automatically enabled

## Environment Variables

For production deployments, you may want to:
1. Update contact information
2. Add Google Analytics ID
3. Configure social media links
4. Set custom branding

Edit `data/projects.json` settings section:
```json
{
  "settings": {
    "siteTitle": "Your Professional Portfolio",
    "siteDescription": "Expert video editing services",
    "contactEmail": "contact@yourdomain.com",
    "socialLinks": {
      "youtube": "https://youtube.com/yourchannel",
      "instagram": "https://instagram.com/yourprofile"
    },
    "analytics": {
      "googleAnalyticsId": "GA-XXXXXXXXXX"
    }
  }
}
```

## Performance Optimization

### Before Deployment
1. Compress images (use WebP format when possible)
2. Minify CSS and JavaScript (optional)
3. Test on multiple devices
4. Check all YouTube video links

### After Deployment
1. Test all functionality
2. Check mobile responsiveness
3. Verify video playback
4. Test contact form
5. Check page load speed

## Monitoring and Analytics

### Google Analytics Setup
1. Create Google Analytics account
2. Create new property for your portfolio
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to `data/projects.json`:
```json
"analytics": {
  "googleAnalyticsId": "G-XXXXXXXXXX"
}
```

### Performance Monitoring
- Use Google PageSpeed Insights
- Check GTmetrix for performance scores
- Monitor Core Web Vitals

## Troubleshooting Deployment Issues

### Common GitHub Pages Issues
1. **404 Errors**
   - Check that repository is public
   - Verify branch and folder settings
   - Ensure `index.html` exists

2. **Styles Not Loading**
   - Check file paths in CSS links
   - Verify case sensitivity in file names
   - Ensure files are in correct directories

3. **Videos Not Playing**
   - Verify YouTube video IDs are correct
   - Check video privacy settings
   - Ensure YouTube embed permissions

4. **JavaScript Errors**
   - Check browser console for errors
   - Verify all JS files are loading
   - Check for syntax errors

### Debugging Steps
1. Check GitHub Pages build logs
2. Use browser developer tools
3. Test locally before deployment
4. Check network tab for failed requests

## Backup and Recovery

### Git Version Control
- All changes are tracked in Git
- Easy rollback to previous versions
- Branch for experimental changes

### Data Backup
```bash
# Export project data
cp data/projects.json backup/projects-$(date +%Y%m%d).json

# Backup images
tar -czf backup/images-$(date +%Y%m%d).tar.gz images/
```

### Recovery
```bash
# Restore from backup
git checkout [commit-hash] -- data/projects.json
git checkout [commit-hash] -- images/
```

## Security Considerations

### YouTube Privacy
- Use unlisted videos for client projects
- Respect client confidentiality
- Add watermarks if necessary

### Contact Form Security
- Consider using CAPTCHA
- Rate limit form submissions
- Validate input data

### HTTPS Enforcement
Add to `.htaccess` (if using custom server):
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Maintenance

### Regular Tasks
- Update portfolio with new projects
- Check for broken YouTube links
- Update contact information
- Refresh featured projects
- Monitor analytics

### Annual Tasks
- Review and update design
- Optimize performance
- Update dependencies
- Check mobile compatibility
- Backup all data

## Scaling Your Portfolio

### Multiple Portfolios
- Create separate repositories for different specializations
- Link between portfolios
- Use consistent branding

### Team Collaboration
- Use Git branches for team work
- Implement pull request reviews
- Use project management tools

### Client Management
- Create client-specific portfolios
- Password protect sensitive projects
- Use client approval workflows