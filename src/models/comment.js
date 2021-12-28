import sequelize from './../db/postgres'
import { DataTypes } from 'sequelize'

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

export default Comment
