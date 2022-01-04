import slug from 'slug'
/**
 * Turns a string into a slug
 * @param {string} string String to slug
 * @returns {string} a slugged string
 */
const slugString = string => slug(string)

export default slugString
