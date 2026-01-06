# Research Institute Website - Deployment Guide

## Overview
This is a complete web application for a research institute featuring:
- **Public Pages**: Home, Research Papers, Events
- **Member Portal**: Login system with member-only content
- **CMS Dashboard**: Staff can upload and manage content
- **Backend API**: Node.js/Express server with file upload and authentication
- **Azure Deployment**: Ready for Azure App Service

## Architecture

```
research-institute-website/
├── public/                    # Frontend files
│   ├── index.html            # Home page
│   ├── research.html         # Research papers page
│   ├── events.html          # Events page
│   ├── login.html           # Member login
│   ├── cms.html             # Staff dashboard
│   ├── styles.css           # Responsive styling
│   ├── papers.json          # Sample papers data
│   ├── events.json          # Sample events data
│   └── news1.json           # Sample news data
├── server.js                 # Express backend
├── package.json              # Dependencies
├── web.config                # Azure IIS configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Prerequisites

- **Node.js** 16+ 
- **npm** 7+
- **Azure Account** (for deployment)
- **Git** (for version control)

## Local Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 4. Access the Application
- **Home Page**: http://localhost:3000
- **Login**: http://localhost:3000/login.html
- **CMS**: http://localhost:3000/cms.html (requires login)

## Features

### Public Pages
- **Home**: Introduction, mission statement, latest news, upcoming events
- **Research Papers**: Browse and download public papers
- **Events**: View upcoming seminars, workshops, conferences

### Member Features (Login Required)
- Access to member-exclusive research papers
- Download restricted content
- Attend member-only events

### CMS Dashboard (Staff Only)
- **News Management**: Publish and edit news articles
- **Events Management**: Create and manage events
- **Papers Management**: Upload research papers with metadata
- **User Management**: Add and manage member accounts

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### News
```
GET /api/news
POST /api/news (authenticated)
DELETE /api/news/:id (authenticated)
```

### Events
```
GET /api/events
POST /api/events (authenticated)
DELETE /api/events/:id (authenticated)
```

### File Upload
```
POST /api/upload (authenticated)
```

### Users
```
GET /api/users (admin only)
POST /api/users (admin only)
```

## Deployment to Azure

### Prerequisites
- Azure App Service plan
- Azure SQL Database (optional, for production)
- Azure Storage Account (optional, for file uploads)

### Deployment Steps

#### 1. Create Azure App Service
```bash
# Using Azure CLI
az appservice plan create --name research-plan --resource-group mygroup --sku B1 --is-linux
az webapp create --resource-group mygroup --plan research-plan --name research-institute-app --runtime "NODE:18-lts"
```

#### 2. Configure Environment Variables in Azure
In Azure Portal, go to App Service > Configuration > Application settings and add:
```
NODE_ENV = production
JWT_SECRET = your-secure-key
PORT = 3000
```

#### 3. Deploy via Git
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add Azure remote (get URL from Azure Portal)
git remote add azure <your-azure-git-url>

# Deploy
git push azure main
```

#### 4. Alternative: Deploy via ZIP
```bash
# Create ZIP file
zip -r app.zip . -x "node_modules/*"

# Deploy via Azure CLI
az webapp deployment source config-zip --resource-group mygroup --name research-institute-app --src app.zip
```

### 5. Verify Deployment
```bash
# Check health endpoint
curl https://research-institute-app.azurewebsites.net/api/health
```

## Database Setup (Production)

For production, replace the in-memory database with a real database:

### Option 1: Azure SQL Database
```bash
# Create database
az sql server create --name research-db-server --resource-group mygroup --admin-user dbadmin --admin-password YourPassword123!
az sql db create --resource-group mygroup --server research-db-server --name research-db
```

### Option 2: MongoDB Atlas
- Create cluster at https://www.mongodb.com/cloud/atlas
- Update connection string in `.env`

## Security Best Practices

1. **Change JWT_SECRET**: Generate a strong secret for production
2. **Use HTTPS**: Azure automatically provides HTTPS
3. **Implement Rate Limiting**: Add express-rate-limit middleware
4. **Validate Inputs**: Use input validation library
5. **Secure Passwords**: Hash passwords with bcrypt
6. **CORS**: Configure CORS to specific domains
7. **Environment Variables**: Keep sensitive data in .env files
8. **Database**: Use parameterized queries to prevent SQL injection

## File Upload Configuration

### Local Storage
Files are saved to `./uploads/` directory

### Azure Blob Storage (Recommended)
```bash
# Install Azure SDK
npm install @azure/storage-blob

# Update server.js to use Blob Storage
# See Azure documentation for implementation
```

## Monitoring & Logging

### Azure Application Insights
```bash
# Install SDK
npm install applicationinsights

# Add to server.js
const appInsights = require('applicationinsights');
appInsights.setup('YOUR_INSTRUMENTATION_KEY').start();
```

## Troubleshooting

### Port Issues
If port 3000 is in use:
```bash
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Azure Deployment Issues
```bash
# View logs
az webapp log tail --name research-institute-app --resource-group mygroup

# Restart app
az webapp restart --name research-institute-app --resource-group mygroup
```

## Testing

### Test API Endpoints
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@researchinstitute.org","password":"password123"}'

# Test news creation
curl -X POST http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test News","content":"Test content"}'
```

## Future Enhancements

- [ ] Implement full database (SQL/MongoDB)
- [ ] Add email notifications
- [ ] Integrate with Azure AD for enterprise authentication
- [ ] Add advanced search functionality
- [ ] Implement paper rating/commenting system
- [ ] Add event registration system
- [ ] Create mobile app
- [ ] Implement caching with Redis
- [ ] Add analytics dashboard

## Support

For issues or questions:
- Email: admin@researchinstitute.org
- Create an issue in the GitHub repository
- Contact Azure support for deployment issues

## License

This project is confidential and for internal use only.

---

**Last Updated**: January 2026
**Version**: 1.0.0
