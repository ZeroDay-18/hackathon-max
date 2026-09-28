const QuestProgressModel = (sequelize, DataTypes) => {
  const QuestProgress = sequelize.define('questProgresses', {
    questId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'quest_progress_user_unique',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'quest_progress_user_unique',
    },
    pomodoroCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  QuestProgress.associate = (models) => {
    QuestProgress.belongsTo(models.quests, {
      foreignKey: 'questId',
      as: 'quest',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    QuestProgress.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return QuestProgress;
};

export default QuestProgressModel;
