import db from '../models/index.js';
import { getOrCreateProgression, serializeProgression } from '../services/progression.service.js';

const User = db.users;
const Group = db.groups;

function serializeUser(user) {
  return {
    id: user.id,
    maxId: user.maxId,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    group: user.group
      ? { id: user.group.id, name: user.group.name }
      : null,
    preferences: {
      interfaceMode: user.interfaceMode,
      onboardingCompletedAt: user.onboardingCompletedAt,
    },
  };
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }],
    });
    const progression = await getOrCreateProgression(user.id);

    return res.json({
      success: true,
      user: serializeUser(user),
      progression: serializeProgression(progression),
    });
  } catch (error) {
    return next(error);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const { interfaceMode, completeOnboarding } = req.body;

    if (interfaceMode !== undefined && !['ru-serious', 'ru-game'].includes(interfaceMode)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_INTERFACE_MODE',
        message: 'Unknown interface mode',
      });
    }

    if (completeOnboarding !== undefined && typeof completeOnboarding !== 'boolean') {
      return res.status(400).json({
        success: false,
        code: 'INVALID_ONBOARDING_VALUE',
        message: 'Invalid onboarding value',
      });
    }

    if (interfaceMode === undefined && completeOnboarding === undefined) {
      return res.status(400).json({
        success: false,
        code: 'EMPTY_PREFERENCES',
        message: 'No preferences to update',
      });
    }

    await req.user.update({
      ...(interfaceMode !== undefined && { interfaceMode }),
      ...(completeOnboarding === true && { onboardingCompletedAt: new Date() }),
    });

    return res.json({
      success: true,
      preferences: {
        interfaceMode: req.user.interfaceMode,
        onboardingCompletedAt: req.user.onboardingCompletedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}
