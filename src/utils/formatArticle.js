import { sanitizeTagsName } from './sanitizeTagsName'

const formatArticles = (data, user) => {
  if (Array.isArray(data)) {
    return data.map(article => formatArticle(article, article.User || user))
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
  favorited: article.favorited ? true : !!article.favorites?.find((fav) => fav.username === user.username) || false,
  favoritesCount: article.favoritesCount ? article.favoritesCount : article.favorites?.length || 0,
  author: {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: !!user?.followers?.find((u) => u.username === user.username)
  },
  tagList: sanitizeTagsName(article)
})

export default formatArticles
