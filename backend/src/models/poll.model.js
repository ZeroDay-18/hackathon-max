const PollModel = (sequelize, DataTypes) => {
  const Poll = sequelize.define('polls', {
    questId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    question: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  });

  Poll.associate = (models) => {
    Poll.belongsTo(models.quests, {
      foreignKey: 'questId',
      as: 'quest',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Poll.hasMany(models.pollOptions, {
      foreignKey: 'pollId',
      as: 'options',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return Poll;
};

export default PollModel;
