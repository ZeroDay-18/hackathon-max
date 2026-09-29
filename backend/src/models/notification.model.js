const NotificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notifications', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('quest_created', 'quest_completed', 'deadline'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    questId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Notification.belongsTo(models.quests, {
      foreignKey: 'questId',
      as: 'quest',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return Notification;
};

export default NotificationModel;
