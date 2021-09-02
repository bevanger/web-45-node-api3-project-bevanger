const express = require('express');

const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then(user => {
      console.log(user)
      res.status(201).json(user)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;

  Users.update(id, changes)
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(next)
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
  const { id } = (req.params);

  Users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(next)

});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { text } = (req.body);
  const { id } = (req.params);
  const newUser = {
    text: text,
    user_id: id
  }

  Posts.insert(newUser)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(next)
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: 'Something bad inside the users router'
  })
})

// do not forget to export the router
module.exports = router;