import { sanitizeTagsName } from './sanitizeTagsName'

export const formatArticles = (data, username) => {
  if (Array.isArray(data)) {
    return data.map(article => formatArticle(article, username))
  }
  return formatArticle(data, username)
}

const formatArticle = (article, username) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  body: article.body,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favorited: article.favorited,
  favoritesCount: article.favoritesCount,
  author: {
    username: article.User.username,
    bio: article.User.bio,
    image: article.User.image,
    following: !!article.User?.followers.find((user) => user.username === username)
  },
  tagList: sanitizeTagsName(article)
}
)
