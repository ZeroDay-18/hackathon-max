const PollOptionModel = (sequelize, DataTypes) => {
  const PollOption = sequelize.define('pollOptions', {
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  PollOption.associate = (models) => {
    PollOption.belongsTo(models.polls, {
      foreignKey: 'pollId',
      as: 'poll',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    PollOption.hasMany(models.pollVotes, {
      foreignKey: 'optionId',
      as: 'votes',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return PollOption;
};

export default PollOptionModel;
