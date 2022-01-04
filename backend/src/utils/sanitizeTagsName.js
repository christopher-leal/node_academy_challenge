/**
 * Tag
 * @typedef {Object} Tag
 * @property {string} name Tag's name
 *
 */

/**
 * Sanitize Tags to return list with its names
 * @param {Array<Tag>} Tags Destructured property Tags
 * @returns {Array<String>} List of tag's names
 */
export const sanitizeTagsName = ({ Tags }) => Tags.map(tag => tag.name)
