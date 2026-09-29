const UserProgressionModel = (sequelize, DataTypes) => {
  const UserProgression = sequelize.define('userProgressions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    reputation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
  });

  UserProgression.associate = (models) => {
    UserProgression.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return UserProgression;
};

export default UserProgressionModel;
