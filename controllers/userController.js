const bcrypt = require('bcrypt')
const User = require('../models/User')
const Note = require('../models/Note')

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    return res.status(404).json({ message: 'Users Not Found' })
  }
  res.status(200).json({ users })
}

// const getUser = (async(req, res) => {

// })

// CREATE USER
const createUser = async (req, res) => {
  const { username, password, roles } = req.body

  // Confirm Data
  if (!username || !password) {
    return res.status(400).json({
      message: 'All fields are required',
    })
  }

  // Check Duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (duplicate) {
    return res.status(409).json({ message: 'duplicate username' })
  }

  // Hash the password
  const hashedPass = await bcrypt.hash(password, 10)
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPass }
      : { username, password: hashedPass, roles }

  // create the user
  const user = await User.create(userObject)
  if (!user) {
    return res
      .status(400)
      .json({ message: 'User not created, Please try again later!' })
  }
  res.status(200).json(user)
}

//  UPDATE USER
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body
  // confirm user
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // check duplicates
  duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (duplicate && duplicate?._id !== id) {
    return res.status(409).json({ message: 'duplicate username' })
  }

  user.username = username
  user.roles = roles
  user.active = active
  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.status(201).json({ message: `${updatedUser.username} updated` })
}

// DELETE USER
const deleteUser = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).json({ message: 'User Id is required' })
  }

  // check the user exist
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // check the user has any notes assigned or not
  const note = await Note.find({ user: id }).lean().exec()
  if (note?.length) {
    return res.status(400).json({ message: 'User has assigned notes' })
  }

  const result = await user.deleteOne()
  const reply = `Username ${result.username} with ID ${result._id} deleted`

  res.status(200).json({ result: reply })
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
}
