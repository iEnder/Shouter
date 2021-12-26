const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const appController = require('../controllers/appController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const shoutController = require('../controllers/shoutController');

/*
    Index Route
*/

router.get('/', appController.index, appController.homePage);

/*
    Auth Routes (Login Logout Register)
*/

router.get('/login', userController.loginForm);
router.post('/login', authController.usernameToLowerCase, authController.login);
router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.validateRegister,
  authController.usernameToLowerCase,
  catchErrors(userController.register),
  authController.login
);
router.get('/logout', authController.isLoggedIn, authController.logout);

/* 
  User Routes
*/

router.get('/:handle', catchErrors(userController.showUsershouts));
router.get('/:handle/following', catchErrors(userController.showUserFollowing));
router.get('/:handle/followers', catchErrors(userController.showUserFollowers));
router.get('/:handle/likes', catchErrors(userController.showUserLikes));

/* 
  Shout Routes
*/

router.post(
  '/shout/new',
  authController.isLoggedIn,
  shoutController.upload,
  catchErrors(shoutController.saveFile),
  catchErrors(shoutController.createshout)
);

router.delete(
  '/shout/:id',
  authController.isLoggedIn,
  catchErrors(shoutController.deleteshout)
);

module.exports = router;

/*
  Api Routes
*/

router.post(
  '/api/user/:id/follow',
  authController.isLoggedIn,
  catchErrors(userController.followUser)
);

router.post(
  '/api/shout/:id/like',
  authController.isLoggedIn,
  catchErrors(shoutController.likeshout)
);

router.get('/api/test', appController.testRoute);
