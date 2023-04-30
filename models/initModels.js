const User = require('../models/users.model');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');
const Order = require('../models/orders.model');
const Review = require('../models/reviews.model');

const initModel = () => {
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.belongsTo(Order);
  Order.belongsTo(Meal);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasMany(Review);
  Review.belongsTo(User);
};

module.exports = initModel;
