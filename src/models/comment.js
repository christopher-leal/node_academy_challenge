import sequelize from './../db/postgres'
import { DataTypes } from 'sequelize'
import User from './user'

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

Comment.belongsTo(User, { targetKey: 'username', foreignKey: 'AuthorUsername' })

export default Comment
