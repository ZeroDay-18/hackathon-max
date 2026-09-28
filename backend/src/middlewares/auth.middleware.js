import db from '../models/index.js';
import { verifyAccessToken } from '../services/jwt.service.js';

const User = db.users;

export async function authenticateToken(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const { userId } = verifyAccessToken(token);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}
