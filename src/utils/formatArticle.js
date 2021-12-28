import { sanitizeTagsName } from './sanitizeTagsName'

const formatArticles = (data, user) => {
  if (Array.isArray(data)) {
    return data.map(article => formatArticle(article, article.User))
  }
  return formatArticle(data, user)
}

const formatArticle = (article, user) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  body: article.body,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favorited: article.favorited,
  favoritesCount: article.favoritesCount,
  author: {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: !!user?.followers.find((u) => u.username === user.username)
  },
  tagList: sanitizeTagsName(article)
}
)

export default formatArticles
