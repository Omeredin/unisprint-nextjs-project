const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
require('dotenv').config({ path: './process.env' });

const app = express();

// Debugging middleware
app.use((req, res, next) => {
    console.log('Request Path:', req.path);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Debug environment variables
console.log('Environment check:', {
    hasClientId: !!GOOGLE_CLIENT_ID,
    hasClientSecret: !!GOOGLE_CLIENT_SECRET,
    port: PORT,
    hasJwtSecret: !!JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
});

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    displayName: { type: String },
    profilePicture: { type: String }
});

const User = mongoose.model('User', userSchema);

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 60 * 1000
    },
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60
    })
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    proxy: true,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Profile:', profile);

        if (!profile || !profile.emails || !profile.emails[0]) {
            return done(new Error('Invalid profile data received from Google'));
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                profilePicture: profile.photos?.[0]?.value
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
        accessType: 'offline'
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000', // Redirect to your login page on failure
        failureMessage: true,
        session: true
    }),
    (req, res) => {
        try {
            // Check if user data is available
            if (!req.user || !req.user.email) {
                console.error('No user data available');
                return res.redirect('http://localhost:3000'); // Redirect to login page
            }

            // Create a JWT token
            const token = jwt.sign(
                { 
                    email: req.user.email,
                    id: req.user._id,
                    displayName: req.user.displayName,
                    profilePicture: req.user.profilePicture
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Redirect to the frontpage with the token
            res.redirect(`http://localhost:3000/frontpage?token=${token}`);
        } catch (error) {
            console.error('Callback error:', error);
            res.redirect('http://localhost:3000'); // Redirect to login page on error
        }
    }
);

// Traditional Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            email: user.email,
            id: user._id,
            displayName: user.displayName,
            profilePicture: user.profilePicture
        }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token,
            user: {
                email: user.email,
                displayName: user.displayName,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Registration Route
app.post('/api/register', async (req, res) => {
    const { email, password, displayName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            displayName
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Info Route
app.get('/api/user', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            email: user.email,
            displayName: user.displayName,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error('User info error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('http://localhost:3000');
    });
});

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
    console.log(`Google callback URL: http://localhost:${PORT}/auth/google/callback`);
});