const express = require('express');
const userControllers = require('./../controllers/userController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
