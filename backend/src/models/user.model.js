const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    maxId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    avatarSeed: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    acceptTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interfaceMode: {
      type: DataTypes.ENUM('ru-serious', 'ru-game'),
      allowNull: false,
      defaultValue: 'ru-serious',
    },
    onboardingCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.groups, {
      foreignKey: 'groupId',
      as: 'group',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
    User.hasOne(models.userProgressions, {
      foreignKey: 'userId',
      as: 'progression',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.notifications, {
      foreignKey: 'userId',
      as: 'notifications',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.progressionEvents, {
      foreignKey: 'userId',
      as: 'progressionEvents',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.pollVotes, {
      foreignKey: 'userId',
      as: 'pollVotes',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return User;
};

export default UserModel;
