
const formatComments = (data, user) => {
  if (Array.isArray(data)) {
    return data.map(comment => formatComment(comment, comment.User))
  }
  return formatComment(data, user)
}

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
