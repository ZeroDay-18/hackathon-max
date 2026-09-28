const GroupModel = (sequelize, DataTypes) => {
  const Group = sequelize.define('groups', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  });

  return Group;
};

export default GroupModel;
