import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'
import Tag from './tag'
import User from './user'

const Article = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING, allowNull: false
  },
  title: {
    type: DataTypes.STRING, allowNull: false
  },
  description: {
    type: DataTypes.STRING, allowNull: false
  },
  body: {
    type: DataTypes.STRING, allowNull: false
  },
  favorited: {
    type: DataTypes.STRING, allowNull: true
  },
  favoritesCount: {
    type: DataTypes.INTEGER, defaultValue: 0
  }

})

Article.belongsTo(User, { as: 'author' })
Article.belongsToMany(Tag, { through: 'tagList' })

export default Article
