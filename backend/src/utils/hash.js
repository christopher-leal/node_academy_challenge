import bcrypt from 'bcryptjs'

export const encrypt = password => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

export const decrypt = (encrypted, hash) => bcrypt.compareSync(encrypted, hash) // true
