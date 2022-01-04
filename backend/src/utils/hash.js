import bcrypt from 'bcryptjs'

/**
 * Hash a string
 * @param {string} password Password to hash
 * @returns {string} Hashed password
 */
export const encrypt = password => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

/**
 * Compare the string with the hashed password and return true they match
 * @param {string} string plain string to compare
 * @param {string} hashed hashed string to compare
 * @returns {boolean} true if the string matches with the hashed
 */
export const decrypt = (string, hashed) => bcrypt.compareSync(string, hashed)
