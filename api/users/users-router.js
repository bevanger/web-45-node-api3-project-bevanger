const express = require('express');

const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user)
});

router.post('/', (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
    .then((success) => {
      if(success) {
        res.status(200).json(req.user)
      } else {
        res.status(404).json({ message: 'The user with that specified ID does not exist'})
      }
    })
    .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  const { id } = (req.params)

  Users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(next)

});

router.post('/:id/posts', (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: 'Something bad inside the users router'
  })
})

// do not forget to export the router
module.exports = router;