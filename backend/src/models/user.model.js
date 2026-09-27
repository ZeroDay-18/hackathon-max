const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
      maxId: {
        type: DataTypes.STRING,
        allowNull: false,
      },    
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      acceptTerms: {
        type: DataTypes.BOOLEAN
      }
    });

    return User;
};

export default UserModel;