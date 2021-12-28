
import Tag from './../models/tag'
import { sanitizeTagsName } from './../utils/sanitizeTagsName'
import logger from './../utils/logger'

const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({})
    return res.json({
      success: true,
      tags: sanitizeTagsName({ Tags: tags })
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      errors: { body: [error.message] }
    })
  }
}

export default {
  getTags
}
