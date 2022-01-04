import { sanitizeTagsName } from './sanitizeTagsName'

/**
 * User
 * @typedef {Object} User
 * @property {string} username User's username
 * @property {string} bio User's bio
 * @property {string} image User's image
 * @property {boolean} following User's following
 *
 */

/**
 * Article
 * @typedef {Object} Article
 * @property {string} slug Article's slug
 * @property {string} title Article's title
 * @property {string} description Article's description
 * @property {string} body Article's body
 * @property {Date} createdAt Article's createdAt
 * @property {Date} updatedAt Article's updatedAt
 * @property {boolean} favorited Article's favorited
 * @property {number} favoritesCount Article's favoritesCount
 * @property {User} author Article's author
 * @property {Array<string>} tagList Article's tagList
 *
 */

/**
 * Format articles|article with needed properties
 * @param {Array<Article>|Article} data Data to format
 * @param {User} user User to use if the article hasn't User property
 * @returns {Array<Article>|Article}
 */

const formatArticles = (data, user) => {
  if (Array.isArray(data)) {
    return data.map(article => formatArticle(article, article.User || user))
  }
  return formatArticle(data, user)
}

/**
 * Format single article with needed properties
 * @param {Article} article Article to format
 * @param {User} user User to use if the article hasn't User property
 * @returns {Article} The formatted article
 */
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
