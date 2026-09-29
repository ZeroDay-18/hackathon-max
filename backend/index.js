import 'dotenv/config'
import express from 'express';
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import db from './src/models/index.js'
import './src/bot/index.js'

import authRoutes from './src/routes/auth.routes.js'
import questRoutes from './src/routes/quest.routes.js'
import profileRoutes from './src/routes/profile.routes.js'
import pollRoutes from './src/routes/poll.routes.js'
import notificationRoutes from './src/routes/notification.routes.js'

const app = express();
const port = 3000;

// Secure
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], 
  credentials: false,
}))
app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ extended: false, limit: '1mb' }))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}))

// Main
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/polls', pollRoutes)
app.use('/api/notifications', notificationRoutes)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((error, req, res, next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

try {
  await db.sequelize.authenticate()
  console.log('БД Подключена')

  await db.sequelize.sync({ alter: true })

  // App boot
  app.listen(port, () => {
    console.log(`Приложение запущено на порте: ${port}`);
  });
} catch (error) {
  console.error('Ошибка БД:', error)
  process.exit(1)
}