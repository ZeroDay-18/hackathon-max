import express from 'express';
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const app = express();
const port = 3000;

// Secure
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
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
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});