const express = require('express');

//CONTROLLERS
const userControllers = require('../controllers/users.controllers');

//MIDDLEWARES
const validation = require('../middlewares/validation.middleware');
const usersMiddleware = require('../middlewares/users.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', validation.signupValidaton, userControllers.signup);

router.post('/login', validation.loginValidation, userControllers.login);

router.use(authMiddleware.protect);

router.get('/orders', userControllers.findAllOrders);

router.get('/orders/:id', userControllers.findOneOrder);

router
  .route('/:id')
  .patch(
    usersMiddleware.validIfUserExist,
    validation.updateUserValidation,
    authMiddleware.protectAccountOwner,
    userControllers.update
  )
  .delete(
    usersMiddleware.validIfUserExist,
    authMiddleware.protectAccountOwner,
    authMiddleware.restrictTo('admin'),
    userControllers.delete
  );

module.exports = router;
