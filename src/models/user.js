import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'

const User = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }

})

User.belongsToMany(User, { as: 'following', through: 'followers', foreignKey: 'user', otherKey: 'follower', sourceKey: 'username', targetKey: 'username' })

export default User
