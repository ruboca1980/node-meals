const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

exports.validIfMealExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'rating'],
      },
    ],
  });

  if (!meal) next(new AppError('Meal not found', 404));

  req.meal = meal;

  next();
});
