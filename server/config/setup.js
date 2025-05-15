// const {AdminJS} = require('adminjs')
// const AdminJSExpress = require('@adminjs/express')
// const AdminJSMongoose = require('@adminjs/mongoose')
// const { dark, light, noSidebar } = require('@adminjs/themes')
// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)

// const User = require('../models/User')
// const Ride = require('../models/Ride')
// const Rating = require('../models/Rating')

// const sessionStore = new MongoDBStore({
//   uri: process.env.MONGO_URI,
//   collection: 'adminSessions',
// })
// sessionStore.on('error', (error) => {
//   console.error('Session store error:', error);
// });

// const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || 'your-cookie-password'

// const admin = new AdminJS({
//   resources: [
//     { resource: User },
//     { resource: Ride },
//     { resource: Rating },
//   ],
//   rootPath: '/admin',
//   branding: {
//     companyName: 'Asbab',
//     withMadeWithLove: false,
//   },
//   defaultTheme: dark.id,
//   availableThemes: [dark, light, noSidebar],
//   adapter: AdminJSMongoose, // ✅ adapter passed here
// })

// // Dummy authentication
// const authenticate = async (email, password) => {
//   if (email === 'admin@example.com' && password === 'admin123') {
//     return { email }
//   }
//   return null
// }

// // Setup router
// const buildAdminRouter = async (app) => {
//   const router = await AdminJSExpress.buildAuthenticatedRouter(
//     admin,
//     {
//       authenticate,
//       cookiePassword: COOKIE_PASSWORD,
//       cookieName: 'adminjs',
//     },
//     app,
//     {
//       store: sessionStore,
//       resave: false,
//       saveUninitialized: true,
//       secret: COOKIE_PASSWORD,
//       cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 1000 * 60 * 60 * 24,
//       },
//     }
//   )
// }

// module.exports = { admin, buildAdminRouter }
