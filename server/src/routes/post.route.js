const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');

router.get('/feed', optionalAuthenticate, postController.getFeed);
router.get('/tags/trending', postController.getTrendingTags);
router.post('/', authenticate, postController.createPost);
router.get('/:id', optionalAuthenticate, postController.getPostById);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;
