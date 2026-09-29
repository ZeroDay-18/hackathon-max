import { validateMaxInitData } from '../services/max-auth.service.js';
import { findUserByMaxId } from '../services/user.service.js';
import { signAccessToken, ACCESS_TOKEN_TTL } from '../services/jwt.service.js';
import { getOrCreateProgression, serializeProgression } from '../services/progression.service.js';
import db from '../models/index.js';

const User = db.users;
const Group = db.groups;

function isDevelopmentBypassEnabled() {
  return process.env.NODE_ENV === 'development' && Boolean(process.env.DEV_USER_ID);
}

async function getDevelopmentUser() {
  const userId = Number(process.env.DEV_USER_ID);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return User.findByPk(userId, {
    include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }],
  });
}

function serializeUser(user, photoUrl = user.photoUrl) {
  return {
    id: user.id,
    maxId: user.maxId,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl,
    avatarSeed: user.avatarSeed || user.maxId,
    group: user.group ? { id: user.group.id, name: user.group.name } : null,
    preferences: {
      interfaceMode: user.interfaceMode,
      onboardingCompletedAt: user.onboardingCompletedAt,
    },
  };
}

export async function maxAuth(req, res, next) {
  try {
    let user;
    let photoUrl;

    if (isDevelopmentBypassEnabled()) {
      user = await getDevelopmentUser();

      if (!user) {
        return res.status(400).json({
          success: false,
          code: 'DEV_USER_NOT_FOUND',
          message: 'DEV_USER_ID does not match a registered user',
        });
      }
    } else {
      const { initData } = req.body;
      const data = validateMaxInitData(initData, process.env.MAX_BOT_TOKEN);
      const maxUser = data.user;
      const maxId = maxUser?.id ?? maxUser?.user_id;

      if (maxId === undefined || maxId === null) {
        return res.status(400).json({
          success: false,
          code: 'MAX_USER_ID_MISSING',
          message: 'MAX user id is missing',
        });
      }

      user = await findUserByMaxId(maxId);
      photoUrl = maxUser?.photo_url;

      if (!user) {
        return res.status(403).json({
          success: false,
          code: 'USER_NOT_REGISTERED',
          message: 'Сначала зарегистрируйтесь в боте: откройте чат с ботом и отправьте команду /start.',
        });
      }
    }

    const progression = await getOrCreateProgression(user.id);
    const token = signAccessToken(user);

    return res.json({
      success: true,
      token,
      expiresIn: ACCESS_TOKEN_TTL,
      user: serializeUser(user, photoUrl),
      progression: serializeProgression(progression),
    });
  } catch (error) {
    return next(error);
  }
}
