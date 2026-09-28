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
    acceptTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.groups, {
      foreignKey: 'groupId',
      as: 'group',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  };

  return User;
};

export default UserModel;
