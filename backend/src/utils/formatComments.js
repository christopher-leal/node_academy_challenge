/**
 * Comment
 * @typedef {Object} Comment
 * @property {number} id Comment's slug
 * @property {string} body Comment's body
 * @property {Array<string>} tagList Comment's tagList
 * @property {Date} createdAt Comment's createdAt
 * @property {Date} updatedAt Comment's updatedAt
 * @property {User} author Comment's author
 *
 */

/**
 * Format comments|comment with needed properties
 * @param {Array<Comment>|Comment} data Data to format
 * @param {User} user User to use if the comment hasn't User property
 * @returns {Array<Comment>|Comment}
 */
const formatComments = (data, user) => {
  if (Array.isArray(data)) {
    return data.map(comment => formatComment(comment, comment.User))
  }
  return formatComment(data, user)
}

/**
 * Format single comment with needed properties
 * @param {Comment} data Data to format
 * @param {User} user User to use if the comment hasn't User property
 * @returns {Comment}
 */
const formatComment = (comment, user) => ({
  id: comment.id,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  body: comment.body,
  author: {
    username: user?.username,
    bio: user?.bio,
    image: user?.image,
    following: !!user?.followers.find((u) => u.username === user.username)
  }

})

export default formatComments
