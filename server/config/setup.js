    require("dotenv").config();
    const { AdminJS } = require('adminjs');
    const AdminJSExpress = require('@adminjs/express');
    const AdminJSMongoose = require('@adminjs/mongoose');
    const { dark, light, noSidebar } = require('@adminjs/themes');
    const session = require('express-session');
    const MongoDBStore = require('connect-mongodb-session')(session);

    const User = require('../models/User');
    const Ride = require('../models/Ride');
    const Rating = require('../models/Rating');
    const Complain = require('../models/Complaints');
    const PORT = process.env.PORT || 3000;

    // ✅ Register the Mongoose adapter correctly
    AdminJS.registerAdapter(AdminJSMongoose);

    // ✅ Setup MongoDB session store
    const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'adminSessions',
    });
    sessionStore.on('error', (error) => {
    console.error('Session store error:', error);
    });

    // ✅ Set cookie password fallback
    const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || 'your-cookie-password';

    // ✅ Create AdminJS instance
    const admin = new AdminJS({
    resources: [
        {
        resource: User,
        options: {
            properties: {
            password: { isVisible: false }, // Hides password field
            },
        },
        },
        { resource: Ride },
        { resource: Rating },
        { resource: Complain },
    ],
    rootPath: '/admin',
    branding: {
        companyName: 'Asbab',
        withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    });

    // ✅ Simple authentication (replace with real logic later)
    const authenticate = async (email, password) => {
    if (email === 'admin@example.com' && password === 'admin123') {
        return { email };
    }
    return null;
    };

    // ✅ Build AdminJS router
    const buildAdminRouter = async (app) => {
    const router = await AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: 'adminjs',
        },
        null,
        {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
        name: 'adminjs',
        }
    );

    app.use(admin.options.rootPath, router);
    console.log(`✅ AdminJS is running at http://localhost:${PORT}${admin.options.rootPath}`);
    };

    module.exports = { admin, buildAdminRouter };
