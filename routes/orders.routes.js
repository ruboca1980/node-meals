const express = require('express');

//CONTROLLERS
const ordersControllers = require('../controllers/orders.controllers');

//MIDDLEWARES
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const ordersMiddlewares = require('../middlewares/orders.mmiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post(
  '/',
  validationMiddleware.createOrderValidation,
  ordersControllers.createOrder
);

router.get('/me', ordersControllers.findUserOrder);

router
  .route('/:id')
  .patch(ordersMiddlewares.validIfExistOrder, ordersControllers.updateOrder)
  .delete(ordersMiddlewares.validIfExistOrder, ordersControllers.deleteOrder);

module.exports = router;
