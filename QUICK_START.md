# Quick Start Guide

## For First-Time Users

### Step 1: View the Website (No Setup Required)
Simply open the files in your browser:
- Open `public/index.html` in your web browser
- Click through the navigation to explore all pages

### Step 2: Test Member Features
1. Click "Member Login" in the navigation
2. Enter credentials:
   - Email: `member@researchinstitute.org`
   - Password: `password123`
3. You'll be redirected to research papers with member-only content visible

### Step 3: Access CMS Dashboard
1. After logging in, you'll see a "Dashboard" link in the navigation
2. Click it to access the CMS dashboard
3. You can now:
   - Add news articles
   - Create events
   - Upload research papers
   - Manage member accounts

---

## For Developers

### Setup (5 minutes)

```bash
# 1. Navigate to project directory
cd /path/to/B-R-JT-Research

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm run dev
```

### Access the Application
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login.html
- **CMS**: http://localhost:3000/cms.html

---

## Site Map

```
/                        → Home page
/research.html          → Research papers listing
/events.html            → Events listing
/login.html             → Member login
/cms.html               → CMS dashboard (members only)

API Endpoints (backend):
/api/auth/login         → Member login
/api/news               → Manage news
/api/events             → Manage events
/api/upload             → File upload
/api/users              → Manage members
```

---

## Key Features

✅ **Public Pages**
- Professional home page with news feed
- Research papers download
- Events calendar

✅ **Member Portal**
- Secure login system
- Member-exclusive papers
- Member-only events

✅ **CMS Dashboard**
- News management
- Event creation
- Paper uploads
- User management

✅ **Modern Design**
- Responsive mobile-friendly layout
- Professional styling
- Smooth animations

✅ **Azure Ready**
- Configured for Azure App Service
- web.config for IIS
- Environment setup for deployment

---

## Test Data Included

### Sample Papers
- Deep Learning Applications in Medical Imaging
- Quantum Computing in Drug Discovery
- Climate Change Impact on Biodiversity
- Advanced Materials for Sustainable Energy Storage (Member Only)
- AI Ethics in Autonomous Systems (Member Only)

### Sample Events
- Annual Research Conference 2026
- Machine Learning Masterclass Workshop
- Climate Science Seminar Series
- Quantum Computing Panel Discussion
- Member Exclusive Advanced Research Methods Workshop
- Sustainable Materials Forum

### Sample News
- Major Research Breakthrough in Sustainable Energy

---

## Customization

### Change Institute Name
Search for "Research Institute" in all HTML files and replace with your institute name.

### Change Colors
Edit `public/styles.css`:
```css
:root {
    --primary-color: #2c3e50;    /* Main color */
    --secondary-color: #3498db;  /* Accent color */
    --accent-color: #e74c3c;     /* Highlight color */
}
```

### Add Custom Papers
Edit `public/papers.json` and add entries in this format:
```json
{
  "title": "Your Paper Title",
  "authors": "Author Names",
  "year": 2026,
  "abstract": "Paper summary",
  "pdf_url": "/papers/filename.pdf",
  "doi_url": "https://doi.org/...",
  "member_only": false
}
```

### Add Custom Events
Edit `public/events.json` and add entries:
```json
{
  "id": 7,
  "title": "Event Name",
  "date": "2026-02-15",
  "time": "10:00 AM",
  "location": "Location",
  "description": "Description",
  "contact_email": "email@institute.org"
}
```

---

## Deployment Options

### Option 1: Azure App Service (Recommended)
See `DEPLOYMENT.md` for complete instructions
- Free tier available for testing
- Automatic HTTPS
- Easy scaling

### Option 2: Any Node.js Hosting
- Heroku
- Digital Ocean
- AWS EC2
- Custom server

### Option 3: Static Hosting (Frontend Only)
If you don't need the backend API:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

---

## Troubleshooting

**Q: I see a 404 error when clicking links**
A: Make sure you're running the Node.js server with `npm run dev`, not just opening HTML files directly.

**Q: Member login doesn't work**
A: In demo mode, authentication is client-side. Use exact credentials:
- Email: member@researchinstitute.org
- Password: password123

**Q: CMS data disappears after refreshing**
A: Demo CMS uses localStorage which clears with browser cache. Upgrade to backend database for persistence.

**Q: Can I run this without Node.js?**
A: Yes, public pages work in any browser. CMS and API features require Node.js server.

---

## Next Steps

1. **Customize Content**
   - Change institute name and colors
   - Update papers, events, and news

2. **Add Your Data**
   - Upload real research papers
   - Add real upcoming events
   - Add current members

3. **Deploy**
   - Choose hosting platform
   - Configure environment variables
   - Deploy using DEPLOYMENT.md guide

4. **Enhance**
   - Connect to real database
   - Integrate email notifications
   - Add Azure AD authentication
   - Implement search functionality

---

## Support

For issues:
1. Check the main README.md
2. See DEPLOYMENT.md for Azure issues
3. Check browser console (F12) for error messages
4. Contact: admin@researchinstitute.org

---

**Version**: 1.0.0  
**Last Updated**: January 2026
