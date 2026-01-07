const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Global logging helpers for Azure App Service diagnostics
const AZURE_LOG_PATH = '/home/LogFiles/app-error.log';
function appendAzureLog(message) {
    try {
        fs.appendFileSync(AZURE_LOG_PATH, message + '\n');
    } catch (e) {
        // best-effort only
        console.error('Failed to write Azure log:', e && e.message);
    }
}

process.on('uncaughtException', (err) => {
    const msg = `[uncaughtException] ${new Date().toISOString()} ${err && err.stack ? err.stack : String(err)}`;
    console.error(msg);
    appendAzureLog(msg);
    // allow a short time for logs to flush
    setTimeout(() => process.exit(1), 200);
});

process.on('unhandledRejection', (reason) => {
    const msg = `[unhandledRejection] ${new Date().toISOString()} ${reason && reason.stack ? reason.stack : String(reason)}`;
    console.error(msg);
    appendAzureLog(msg);
    setTimeout(() => process.exit(1), 200);
});

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads', req.body.type || 'files');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Mock database (replace with real database in production)
let users = [
    { id: 1, email: 'member@researchinstitute.org', password: 'password123', name: 'John Researcher', role: 'member' }
];

let news = [
    { id: 1, title: 'Major Breakthrough', date: '2026-01-06', content: 'New research findings' }
];

let events = [
    { id: 1, title: 'Conference 2026', date: '2026-03-15', time: '09:00', location: 'Main Hall', description: 'Annual conference', contact_email: 'conf@ri.org' }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access token required' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = {
        id: users.length + 1,
        email,
        password, // In production, hash this!
        name,
        role: 'member'
    };
    
    users.push(newUser);
    
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({ token, user: newUser });
});

// News Routes
app.get('/api/news', (req, res) => {
    res.json(news);
});

app.post('/api/news', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    const newNews = {
        id: Math.max(...news.map(n => n.id), 0) + 1,
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    
    news.unshift(newNews);
    res.json(newNews);
});

app.delete('/api/news/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    news = news.filter(n => n.id !== parseInt(req.params.id));
    res.json({ message: 'News deleted' });
});

// Events Routes
app.get('/api/events', (req, res) => {
    res.json(events);
});

app.post('/api/events', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    const newEvent = {
        id: Math.max(...events.map(e => e.id), 0) + 1,
        ...req.body
    };
    
    events.push(newEvent);
    res.json(newEvent);
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    events = events.filter(e => e.id !== parseInt(req.params.id));
    res.json({ message: 'Event deleted' });
});

// File Upload Route
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            path: `/uploads/${req.body.type || 'files'}/${req.file.filename}`,
            size: req.file.size
        }
    });
});

// User Management Routes
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    res.json(users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })));
});

app.post('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    const newUser = {
        id: users.length + 1,
        ...req.body,
        password: 'temp-password' // Should be sent via secure channel
    };
    
    users.push(newUser);
    res.json({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    const startMsg = `Research Institute API running on port ${PORT}`;
    console.log(startMsg);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    appendAzureLog(`[startup] ${new Date().toISOString()} ${startMsg} env=${process.env.NODE_ENV || 'development'}`);
});
