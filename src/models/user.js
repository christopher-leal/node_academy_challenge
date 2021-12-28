import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'
import Followers from './followers'

const User = sequelize.define('User', {
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

User.belongsToMany(User, { as: 'followers', through: Followers, sourceKey: 'username', targetKey: 'username', foreignKey: 'following', otherKey: 'follower' })

export default User
