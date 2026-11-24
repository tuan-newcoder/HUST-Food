const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateMe);
router.get('/:username', optionalAuthenticate, userController.getProfileByUsername);
router.get('/:username/posts', optionalAuthenticate, userController.getPostsByUsername);
router.post('/:id/follow', authenticate, userController.followUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;
