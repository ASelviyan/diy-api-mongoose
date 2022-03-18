const express = require('express')
const router = express.Router()
const db = require('../models')

// GET /blog -- READ all blogs
router.get('/', (req, res) => {
    db.Blog.find({})
      .then(blogs => res.json(blogs))
      .catch(console.log)
})

// POST /blog -- CREATE a blog
router.post('/', (req, res) => {
  // create blog with req.body
  db.Blog.create(req.body)
    .then(newBlog => {
      // send the newloy created blog back/redirect
      res.json(newBlog)
    })
    // handle an error
    .catch(console.log)
})

// GET /blog/:id -- READ a single blog @ :id
router.get('/:id', (req, res) => {
  db.Blog.findById(req.params.id)
    .then(foundBlog => {
      if (!foundBlog) return res.status(404).json({ msg: 'blog not found' })
      res.json(foundBlog)
    })
    .catch(err => {
      if (err.name === 'CastError') return res.status(404).json({ msg: 'I cant find that blob, because the id was malformed' })
      res.status(503).json({ msg: 'server burned down' })
    })
})

// PUT /blog/:id -- UPDATE a single blog @ :id
router.put('/:id', (req, res) => {
  db.Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedBlog => res.json(updatedBlog))
    .catch(err => {
      console.log(err)
      res.status(503).json({ msg: 'whoops' })
    })
})

// DELETE /blog/:id -- DESTROY a blog @ :id
router.delete('/:id', (req, res) => {
  db.Blog.findByIdAndDelete(req.params.id)
    .then(() => res.status(204))
    .catch(err => {
      console.log(err)
      res.status(503).json({ msg: 'error' })
    })
})

router.post('/:id/comment', async (req, res) => {
  try {
    // find the blog at :id
    const blog = await db.Blog.findById(req.params.id)
    // push it to the blog's comment array
    blog.comments.push(req.body)
    // save the blog
    await blog.save()
    // send the blog back inthe response
    res.json(blog)
  } catch (err) {
    console.log(err)
    res.status(503).json({ msg: 'error' })
  }
})

module.exports = router