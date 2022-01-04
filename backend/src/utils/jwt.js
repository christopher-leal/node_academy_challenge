import jwt from 'jsonwebtoken'

/**
 * Generate token with payload
 * @param {object} payload payload to turn into a token
 * @returns {object} the generated token
 */
export const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SEED, { expiresIn: '8h' })

/**
 * Decrypt payload with token
 * @param {string} token token to decrypt
 * @returns {object} the payload encrypted in the token
 */
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SEED)
