import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'

const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  }
})

export default Tag
