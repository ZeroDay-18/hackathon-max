const QuestModel = (sequelize, DataTypes) => {
  const Quest = sequelize.define('quests', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('homework', 'lab', 'exam_prep', 'poll', 'personal'),
      allowNull: false,
      defaultValue: 'homework',
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Quest.associate = (models) => {
    Quest.belongsTo(models.users, {
      foreignKey: 'creatorId',
      as: 'creator',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Quest.belongsTo(models.groups, {
      foreignKey: 'groupId',
      as: 'group',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Quest.belongsTo(models.users, {
      foreignKey: 'assignedUserId',
      as: 'assignedUser',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Quest.hasMany(models.questProgresses, {
      foreignKey: 'questId',
      as: 'progresses',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return Quest;
};

export default QuestModel;
