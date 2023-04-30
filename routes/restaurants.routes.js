const express = require('express');

//CONTROLLERS
const restaurantController = require('../controllers/restaurants.controllers');

//MIDDLEWARES
const restaurantMiddleware = require('../middlewares/restaurants.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', restaurantController.findAllRestaurants);

router.get(
  '/:id',
  restaurantMiddleware.validIfRestaurantExist,
  restaurantController.findOneRestaurant
);

router.use(authMiddleware.protect);

router.post(
  '/',
  validationMiddleware.createRestaurantValidation,
  restaurantController.createRestaurant
);

router
  .route('/:id')
  .patch(
    restaurantMiddleware.validIfRestaurantExist,
    validationMiddleware.updaterestaurantValidation,
    restaurantController.updateRestaurant
  )
  .delete(
    restaurantMiddleware.validIfRestaurantExist,
    restaurantController.deleteRestaurant
  );

router.post(
  '/reviews/:id',
  restaurantMiddleware.validIfRestaurantExist,
  restaurantController.createReview
);

router
  .route('/reviews/:restaurantId/:id')
  .patch(
    validationMiddleware.updateReviewValidation,
    restaurantMiddleware.validReviewOfRestuarant,
    authMiddleware.protectReviewOwner,
    restaurantController.updateReviewRestaurant
  )
  .delete(
    restaurantMiddleware.validReviewOfRestuarant,
    authMiddleware.protectReviewOwner,
    restaurantController.deleteReview
  );

module.exports = router;
