import User from './user'
import Article from './article'
import Tag from './tag'
import Comment from './comment'

User.hasMany(Article, { foreignKey: 'author', sourceKey: 'username' })
Article.belongsTo(User, { foreignKey: 'author', targetKey: 'username' })

Article.belongsToMany(Tag, { through: 'TagList' })
Tag.belongsToMany(Article, { through: 'TagList' })

Article.hasMany(Comment)
Comment.belongsTo(Article)

User.hasMany(Comment)
Comment.belongsTo(User, { targetKey: 'username', foreignKey: 'AuthorUsername' })

User.belongsToMany(User, { as: 'followers', through: 'Followers', sourceKey: 'username', targetKey: 'username', foreignKey: 'following', otherKey: 'follower' })

User.belongsToMany(Article, { through: 'Favorites', as: 'favorites' })
Article.belongsToMany(User, { through: 'Favorites', as: 'favorites' })
