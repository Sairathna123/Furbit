const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth'); // Make sure this path is correct

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

// POST new post (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, pet } = req.body;

    const post = new Post({
      user: {
        name: req.userName,  // injected from auth middleware
        pet
      },
      title,
      content,
      tags
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

module.exports = router;
