const express = require('express');

//CONTROLLERS
const mealsControllers = require('../controllers/meals.controllers');

//MIDDLEWARES
const mealsMiddleware = require('../middlewares/meals.middleware');
const restaurantMiddleware = require('../middlewares/restaurants.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', mealsControllers.findAllMeals);

router.get(
  '/:id',
  mealsMiddleware.validIfMealExist,
  mealsControllers.findOneMeal
);

router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

router
  .route('/:id')
  .post(
    validationMiddleware.createMealValidation,
    restaurantMiddleware.validIfRestaurantExist,
    mealsControllers.createMeal
  )
  .patch(
    validationMiddleware.createMealValidation,
    mealsMiddleware.validIfMealExist,
    mealsControllers.updateMeal
  )
  .delete(mealsMiddleware.validIfMealExist, mealsControllers.deleteMeal);

module.exports = router;
