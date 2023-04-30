const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

exports.findAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'rating'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'All meals has been found',
    resutls: meals.length,
    meals,
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req;

  const meal = await Meal.create({
    name: name.toLowerCase(),
    price,
    restaurantId: restaurant.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Meal has been created',
    meal,
  });
});

exports.findOneMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    message: 'Meal was found',
    meal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({
    name: name.toLowerCase(),
    price,
  });

  res.status(200).json({
    status: 'success',
    message: 'Meal has been updated',
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({
    status: 'disabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'Meal has been disabled',
  });
});
