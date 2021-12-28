import { DataTypes } from 'sequelize'
import sequelize from './../db/postgres'
import Tag from './tag'
import User from './user'
import Comment from './comment'

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

Article.belongsTo(User, { foreignKey: 'author', targetKey: 'username' })
Article.belongsToMany(Tag, { through: 'TagList' })
Article.hasMany(Comment)

export default Article
