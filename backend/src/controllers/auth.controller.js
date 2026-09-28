import { validateMaxInitData } from '../services/max-auth.service.js';
import { findUserByMaxId } from '../services/user.service.js';
import { signAccessToken, ACCESS_TOKEN_TTL } from '../services/jwt.service.js';

export async function maxAuth(req, res, next) {
  try {
    const { initData } = req.body;

    const data = validateMaxInitData(
      initData,
      process.env.MAX_BOT_TOKEN,
    );

    const maxUser = data.user;
    const maxId = maxUser?.id ?? maxUser?.user_id;

    if (maxId === undefined || maxId === null) {
      return res.status(400).json({
        success: false,
        message: 'MAX user id is missing',
      });
    }

    const user = await findUserByMaxId(maxId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Пользователь ещё не зарегистрирован в боте',
      });
    }

    const token = signAccessToken(user);

    return res.json({
      success: true,
      token,
      expiresIn: ACCESS_TOKEN_TTL,
      user: {
        id: user.id,
        maxId: user.maxId,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: maxUser?.photo_url ?? user.photoUrl,
        group: user.group
          ? {
              id: user.group.id,
              name: user.group.name,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
}
