import { UniqueConstraintError } from 'sequelize';
import db from '../models/index.js';

const { sequelize, users: User, groups: Group } = db;

export async function findUserByMaxId(maxId, options = {}) {
  if (maxId === undefined || maxId === null || maxId === '') {
    return null;
  }

  return User.findOne({
    where: { maxId: String(maxId) },
    include: [
      {
        model: Group,
        as: 'group',
        attributes: ['id', 'name'],
      },
    ],
    ...options,
  });
}

export async function registerUser({
  maxId,
  firstName,
  lastName,
  groupName,
  photoUrl = null,
  acceptTerms = false,
}) {
  const normalizedMaxId = String(maxId ?? '').trim();
  const normalizedFirstName = String(firstName ?? '').trim();
  const normalizedLastName = lastName ? String(lastName).trim() : null;
  const normalizedGroupName = String(groupName ?? '').trim();

  if (!normalizedMaxId) {
    throw new Error('MAX user id is required');
  }

  if (!normalizedFirstName) {
    throw new Error('MAX first name is required');
  }

  if (!normalizedGroupName) {
    throw new Error('Group is required');
  }

  const existingUser = await findUserByMaxId(normalizedMaxId);
  if (existingUser) {
    return {
      created: false,
      user: existingUser,
    };
  }

  try {
    return await sequelize.transaction(async (transaction) => {
      const [group] = await Group.findOrCreate({
        where: { name: normalizedGroupName },
        defaults: { name: normalizedGroupName },
        transaction,
      });

      const user = await User.create(
        {
          maxId: normalizedMaxId,
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
          photoUrl,
          avatarSeed: normalizedMaxId,
          acceptTerms,
          groupId: group.id,
        },
        { transaction },
      );

      const userWithGroup = await User.findByPk(user.id, {
        include: [
          {
            model: Group,
            as: 'group',
            attributes: ['id', 'name'],
          },
        ],
        transaction,
      });

      return {
        created: true,
        user: userWithGroup,
      };
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const user = await findUserByMaxId(normalizedMaxId);
      if (user) {
        return {
          created: false,
          user,
        };
      }
    }

    throw error;
  }
}
