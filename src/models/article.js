import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'
const Article = sequelize.define('Article', {
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false
  },
  favorited: {
    type: DataTypes.STRING,
    allowNull: true
  },
  favoritesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }

})

export default Article
