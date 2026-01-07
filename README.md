# Research Institute Website

A comprehensive, modern website for research institutes featuring public pages, member portal with authentication, research paper downloads, event management, and a complete CMS for staff.

## Features

### 🌐 Public Pages
- **Home Page**: Professional introduction with mission statement, latest news, and upcoming events preview
- **Research Papers**: Browse and download publicly available research papers
- **Events**: View all upcoming seminars, workshops, and conferences with registration capability

### 🔐 Member Portal
- **Secure Login**: Email/password authentication with localStorage-based session management
- **Member-Only Content**: Access to exclusive research papers and member-only events
- **Dashboard Link**: Quick access to CMS from navigation when logged in

### 📊 CMS Dashboard
Staff can manage all website content:
- **News Management**: Create, publish, and delete news articles
- **Events Management**: Schedule and manage upcoming events
- **Papers Management**: Upload research papers with metadata (authors, abstract, DOI, member-only flag)
- **User Management**: Add and manage institute members with different roles

### 🎨 Design Features
- **Responsive Design**: Looks great on mobile, tablet, and desktop
- **Modern UI**: Professional color scheme and typography
- **Smooth Interactions**: Hover effects and transitions
- **Accessibility**: Semantic HTML and proper contrast ratios

## Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Local Storage for authentication

### Backend
- Node.js & Express.js
- JWT (JSON Web Tokens) for authentication
- Multer for file uploads
- CORS enabled for API access

### Deployment
- Azure App Service ready
- Azure SQL Database compatible
- Azure Blob Storage compatible
- IIS configuration included (web.config)

## Quick Start

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Access Application
- **Home**: http://localhost:3000
- **Member Login**: http://localhost:3000/login.html
  - Test credentials: `member@researchinstitute.org` / `password123`
- **CMS Dashboard**: http://localhost:3000/cms.html (requires login)

## Project Structure

```
public/
├── index.html          # Home page
├── research.html       # Research papers
├── events.html         # Events listing
├── login.html          # Member login
├── cms.html            # Staff dashboard
├── styles.css          # All styling
├── papers.json         # Papers data
├── events.json         # Events data
└── news1.json          # News data

server.js              # Express backend
package.json           # Dependencies
web.config             # Azure/IIS config
DEPLOYMENT.md          # Azure deployment guide
```

## Key Pages Overview

### Home Page (index.html)
- Hero section with institute name and tagline
- Mission statement with feature cards
- Latest news feed (from news1.json)
- Preview of upcoming events
- Responsive navigation bar
- Footer with contact information

### Research Papers (research.html)
- Grid layout showing research papers
- Public papers always visible
- Member-only papers (lock icon) shown only when logged in
- Download PDF and view DOI links for each paper
- Paper metadata: title, authors, year, abstract

### Events (events.html)
- Grid display of all upcoming events
- Event cards with date, time, location, description
- "Register Interest" email button for each event
- Styled event header with gradient background

### Member Login (login.html)
- Simple email/password form
- Client-side validation
- Success/error messages
- Redirect to research papers after successful login
- Contact admin link for account requests

### CMS Dashboard (cms.html)
- Sidebar menu for different management sections
- **News Tab**: Add/publish news articles
- **Events Tab**: Create events with full details
- **Papers Tab**: Upload papers with metadata
- **Users Tab**: Manage member accounts
- All data stored in localStorage for demo purposes

## Authentication System

### Current Implementation (Demo)
- Client-side validation
- localStorage for token storage
- Token = 'member_' + base64(email) + timestamp

### Production Upgrade Path
```javascript
// Backend API endpoints ready:
POST /api/auth/login      // Returns JWT token
POST /api/auth/register   // Create new account
```

## API Endpoints (Backend)

```
Authentication:
  POST /api/auth/login
  POST /api/auth/register

News:
  GET /api/news
  POST /api/news (authenticated)
  DELETE /api/news/:id (authenticated)

Events:
  GET /api/events
  POST /api/events (authenticated)
  DELETE /api/events/:id (authenticated)

File Upload:
  POST /api/upload (authenticated)

Users:
  GET /api/users (admin)
  POST /api/users (admin)

Health Check:
  GET /api/health
```

## Customization

### Update Institute Name
Edit in:
- `public/index.html` - Line 13
- `public/research.html` - Line 13
- `public/events.html` - Line 13
- `public/login.html` - Line 13
- `public/styles.css` - Logo styling

### Change Colors
Modify CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #2c3e50;      /* Dark blue */
    --secondary-color: #3498db;    /* Light blue */
    --accent-color: #e74c3c;       /* Red */
}
```

### Add More Papers
Edit `public/papers.json`:
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

### Add More Events
Edit `public/events.json`:
```json
{
  "id": 7,
  "title": "Event Name",
  "date": "2026-02-15",
  "time": "10:00 AM",
  "location": "Building, Room",
  "description": "Event details",
  "contact_email": "organizer@institute.org"
}
```

## Security Notes

### Current Demo State
⚠️ This is a demo version with simplified authentication. For production:

### Production Checklist
- [ ] Implement backend authentication (JWT with bcrypt password hashing)
- [ ] Use HTTPS (automatic on Azure)
- [ ] Set strong JWT_SECRET in environment variables
- [ ] Replace localStorage with secure HTTP-only cookies
- [ ] Implement real database (SQL/MongoDB)
- [ ] Add input validation and sanitization
- [ ] Enable CORS for specific origins only
- [ ] Implement rate limiting on API endpoints
- [ ] Add Content Security Policy headers
- [ ] Implement file upload restrictions
- [ ] Add logging and monitoring

## Deployment to Azure

### Quick Deploy (5 minutes)
```bash
# 1. Create resource group
az group create --name research-rg --location eastus

# 2. Create App Service plan
az appservice plan create --name research-plan --resource-group research-rg --sku B1 --is-linux

# 3. Create web app
az webapp create --resource-group research-rg --plan research-plan --name research-institute --runtime "NODE:18-lts"

# 4. Deploy code
git init
git add .
git commit -m "Initial"
git remote add azure <your-azure-git-url>
git push azure main
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Future Enhancements

- Integrate Azure AD for enterprise authentication
- Implement search functionality
- Add paper recommendations system
- Event registration and attendance tracking
- Email notifications
- Analytics dashboard
- Mobile app
- Multi-language support

## Testing Credentials

**Demo Member Account:**
- Email: `member@researchinstitute.org`
- Password: `password123`

## Troubleshooting

### Papers not loading?
- Ensure `papers.json` is in `public/` folder
- Check browser console for errors (F12)

### CMS data not persisting?
- Demo uses localStorage (clears with browser cache)
- Use backend API endpoints for persistent storage

### Member content still showing after logout?
- Clear browser localStorage: Settings > Clear browsing data > Cookies and cache

## Support & Contribution

For questions or improvements, contact: admin@researchinstitute.org

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**License**: Confidential
