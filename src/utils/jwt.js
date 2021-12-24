import jwt from 'jsonwebtoken'

export const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SEED, { expiresIn: '8h' })

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SEED)
