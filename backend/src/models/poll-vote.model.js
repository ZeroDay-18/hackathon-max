const PollVoteModel = (sequelize, DataTypes) => {
  const PollVote = sequelize.define('pollVotes', {
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'poll_user_vote_unique',
    },
    optionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'poll_user_vote_unique',
    },
  });

  PollVote.associate = (models) => {
    PollVote.belongsTo(models.polls, {
      foreignKey: 'pollId',
      as: 'poll',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    PollVote.belongsTo(models.pollOptions, {
      foreignKey: 'optionId',
      as: 'option',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    PollVote.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return PollVote;
};

export default PollVoteModel;
