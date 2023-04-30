const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users.model');
const Order = require('../models/orders.model');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'User has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
      status: 'active',
    },
  });

  if (!user) next(new AppError('Email or password incorrectly', 401));

  if (!(await bcrypt.compare(password, user.password)))
    next(new AppError('Email or password incorrectly', 401));

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'User has been loged',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The user has been update',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({
    status: 'disabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'User has been disabled',
  });
});

exports.findAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await User.findOne({
    where: {
      id: sessionUser.id,
      status: 'active',
    },
    attributes: ['id', 'name', 'email'],
    include: [
      {
        model: Order,
        attributes: ['id', 'mealId', 'totalPrice', 'quantity', 'status'],
        include: [
          {
            model: Meal,
            attributes: ['id', 'name', 'price'],
            include: [
              {
                model: Restaurant,
                attributes: ['id', 'name', 'address', 'rating'],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'All orders has been found',
    user,
  });
});

exports.findOneOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: {
      id,
      userId: sessionUser.id,
      status: status,
    },
    include: [
      {
        model: Meal,
        attributes: ['id', 'name', 'price'],
        include: [
          {
            model: Restaurant,
            attributes: ['id', 'name', 'address', 'rating'],
          },
        ],
      },
    ],
  });

  if (!order)
    next(new AppError(`User dont have this order with id ${id}`, 404));

  res.status(200).json({
    status: 'success',
    message: 'Order was found',
    order,
  });
});
