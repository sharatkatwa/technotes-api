const express = require('express')
const userController = require('./../controllers/userController')
const verifyJWT = require('../middlewares/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
