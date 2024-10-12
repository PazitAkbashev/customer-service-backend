const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a Post
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,  // Use the ID from the decoded token (authMiddleware must attach this)
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);  // Log error
    res.status(500).json({
      message: 'Error creating post',
      error: error.message || error,
    });
  }
};

// Fetch All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);  // Log error
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message || error,
    });
  }
};

// Like a Post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);  // Log error
    res.status(500).json({
      message: 'Error liking post',
      error: error.message || error,
    });
  }
};

// Add a Comment to a Post
exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      body: req.body.body,  // תוכן התגובה מהבקשה
      postId: req.params.postId,  // מזהה הפוסט
      userId: req.user.id,  // המזהה מהטוקן
    });
    res.status(201).json(comment);  // מחזיר את התגובה שנוצרה
  } catch (error) {
    console.error('Error adding comment:', error);  // רושם שגיאה
    res.status(500).json({
      message: 'Error adding comment',
      error: error.message || error,
    });
  }
};
