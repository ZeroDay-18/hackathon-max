const ProgressionEventModel = (sequelize, DataTypes) => {
  const ProgressionEvent = sequelize.define('progressionEvents', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'progression_event_source_unique',
    },
    source: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: 'progression_event_source_unique',
    },
    sourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'progression_event_source_unique',
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
  });

  ProgressionEvent.associate = (models) => {
    ProgressionEvent.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return ProgressionEvent;
};

export default ProgressionEventModel;
