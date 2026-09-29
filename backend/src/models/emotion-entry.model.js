const EmotionEntryModel = (sequelize, DataTypes) => {
  const EmotionEntry = sequelize.define('emotionEntries', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    entryMethod: { type: DataTypes.ENUM('thermometer', 'measurement'), allowNull: false },
    basicEmotionCode: { type: DataTypes.STRING(64), allowNull: true },
    emotionCode: { type: DataTypes.STRING(64), allowNull: true },
    intensity: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 10 } },
    valence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: -5, max: 5, notZero(value) { if (value === 0) throw new Error('valence cannot be zero'); } },
    },
    energy: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 10 } },
    quadrant: { type: DataTypes.ENUM('blue', 'green', 'red', 'yellow'), allowNull: false },
    trigger: { type: DataTypes.STRING(1000), allowNull: false },
    occurredAt: { type: DataTypes.DATE, allowNull: false },
  }, {
    indexes: [{ fields: ['userId', 'occurredAt'] }],
  });

  EmotionEntry.associate = (models) => {
    EmotionEntry.belongsTo(models.users, { foreignKey: 'userId', as: 'user', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
  };

  return EmotionEntry;
};

export default EmotionEntryModel;
