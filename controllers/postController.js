const Post = require('../models/Post');
const User = require('../models/User');
// Assuming you have a Friendship model defined with a method to check friendship
const Friendship = require('../models/Friendship');

// Define the isFriend function within the postController
async function isFriend(userId1, userId2) {
    console.log(`Checking friendship between ${userId1} and ${userId2}`);
    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId1, recipient: userId2 },
        { requester: userId2, recipient: userId1 }
      ],
      status: 'accepted'
      
    });
    console.log('Friendship status:', friendship);
    return !!friendship; // Return true if they are friends, otherwise false
  }
  
  // Controller function to get posts based on friendship status
  async function getPostsForUser(req, res) {
    const viewerId = req.user._id; // Assuming the user is authenticated and their ID is available
    const posterId = req.params.userId; // ID of the user whose posts are being requested
  
    try {
      // Check if the viewer and the poster are friends
      const friends = await isFriend(viewerId, posterId);
      console.log(`Are they friends? ${friends}`);
  
      // Define the filter condition based on friendship status
      const visibilityFilter = friends ? ['public', 'friend'] : ['public'];
      console.log('Visibility filter:', visibilityFilter);
      // Fetch posts based on the determined visibility
      const posts = await Post.find({
        author: posterId,
        visibility: { $in: visibilityFilter }
      }).sort({ createdAt: -1 });
      
      console.log('Posts found:', posts);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch posts' });
    }
  }

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Server error while fetching posts' });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log('Fetched post:', post);
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error.message);
        res.status(500).json({ message: 'Server error while fetching post' });
    }
};

// Create a new post
const createPost = async (req, res) => {
    const { author_avatar, author_name, photo, caption } = req.body;

    const newPost = new Post({
        author_avatar,
        author_name,
        photo,
        caption,
    });

    try {
        const savedPost = await newPost.save();
        console.log('Created new post:', savedPost);
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(400).json({ message: 'Error creating post' });
    }
};

// Update an existing post by ID
const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) {
            console.log('Post not found for update:', req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log('Updated post:', updatedPost);
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(400).json({ message: 'Error updating post' });
    }
};

// Delete a post by ID
const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            console.log('Post not found for deletion:', req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log('Deleted post:', deletedPost);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
};


module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsForUser,
};
