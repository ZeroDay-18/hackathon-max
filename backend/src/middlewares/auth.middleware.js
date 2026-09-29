import db from '../models/index.js';
import { verifyAccessToken } from '../services/jwt.service.js';

const User = db.users;

async function getDevelopmentUser() {
  if (process.env.NODE_ENV !== 'development' || !process.env.DEV_USER_ID) {
    return null;
  }

  const userId = Number(process.env.DEV_USER_ID);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return User.findByPk(userId);
}

export async function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      const developmentUser = await getDevelopmentUser();
      if (developmentUser) {
        req.user = developmentUser;
        return next();
      }

      return res.status(401).json({
        success: false,
        code: 'ACCESS_TOKEN_REQUIRED',
        message: 'Access token required',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_ACCESS_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    const { userId } = verifyAccessToken(token);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_ACCESS_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      code: 'INVALID_ACCESS_TOKEN',
      message: 'Invalid or expired token',
    });
  }
}
