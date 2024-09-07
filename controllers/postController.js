const Post = require('../models/Post');
const User = require('../models/User');
const Group = require('../models/Group');
const mongoose = require('mongoose');
// Assuming you have a Friendship model defined with a method to check friendship
const Friendship = require('../models/Friendship');

// Define the isFriend function within the postController
async function isFriend(userId1, userId2) {
    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId1, recipient: userId2 },
        { requester: userId2, recipient: userId1 }
      ],
      status: 'Accepted'
      
    });
    return !!friendship; // Return true if they are friends, otherwise false
  }
  
  // Controller function to get posts based on friendship status
  const getPostsForUser = async (req, res) => {
    try {
        const currentUser = req.headers.username;

        let publicPosts = await Post.find({ visibility: 'Public', group: null});

        // Get all friend posts
        let friendPosts = await Post.find({ visibility: 'Friend', group: null });


        let ownFriendPosts = await Post.find({ author: currentUser, visibility: 'Friend', group: null });

        // Filter friend posts by checking if the author is a friend of the current user
        let postsFromFriends = [];

        for (let post of friendPosts) {
            if (await isFriend(currentUser, post.author)) {

                postsFromFriends.push(post);
            }
        }

        const allPosts = [...publicPosts, ...postsFromFriends, ...ownFriendPosts];

        const result = await Promise.all(allPosts.map(async (post) => {
            const user = await User.findOne({ username: post.author }); 
            return {
                fullname: user.fullName,
                avatar: user.avatar,
                post: post
            };
        }));


        res.json(result);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Unable to fetch posts' });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const postId = req.query.postId;

        const post = await Post.findOne({ id: postId });
        
        if (!post) {
            console.log('Post not found:', req.query.postId);
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error.message);
        res.status(500).json({ message: 'Server error while fetching post' });
    }
};

// // Create a new post
const createPost = async (req, res) => {
    try {
        console.log(req);
        const postData = req.body;
        console.log(postData);
        // Extract data from request body
        const { author, content, visibility, group } = req.body;

        const date = new Date();
        const day = (`0${date.getDate()}`).slice(-2);
        const year = date.getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const formattedDate = `${day} ${month} ${year}`;


        const images = [];

        if (req.files && req.files.post) {
            req.files.post.forEach(file => {
                images.push(`/uploads/post/${file.filename}`);
            });
        }
        // Create a new Post instance with data from the request body
        // Any field not provided will use the default values from the schema
        const newPost = new Post({
            author,
            content,
            images, // This will default to an empty array if not provided
            visibility, // This will default to 'Public' if not provided
            group,// This will default to null if not provided
            createdAt: formattedDate, 
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        // Send the saved post as a response
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const createPostInGroup = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const postData = req.body;
        const { author, content} = req.body;

        const group = await Group.findOne({ id: groupId });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const date = new Date();
        const day = (`0${date.getDate()}`).slice(-2);
        const year = date.getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const formattedDate = `${day} ${month} ${year}`;


        const images = [];

        if (req.files && req.files.group) {
            req.files.group.forEach(file => {
                images.push(`/uploads/group/${file.filename}`);
            });
        }

        const newPost = new Post({
            author,
            content,
            images, // This will default to an empty array if not provided
            visibility: 'Group', // This will default to 'Public' if not provided
            group: groupId,// This will default to null if not provided
            createdAt: formattedDate, 
        });

        const savedPost = await newPost.save();

        group.posts.push(savedPost.id);
        await group.save();


        res.status(201).json(savedPost);
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg:"Sever error handling reaction"})
    }
}

// Update an existing post by ID
const updatePost = async (req, res) => {
    try {
        const postId = req.query.postId;

        const { author, content, visibility, group } = req.body;

        const post = await Post.findOne({ id: postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const oldImage = req.body.post

        const images = oldImage ? [oldImage] : [];

        if (req.files && req.files.post) {
            req.files.post.forEach(file => {
                images.push(`/uploads/post/${file.filename}`);
            });
        }
        
        post.editHistory.push({
            content: post.content,      // Save the old content
            images: post.images,        // Save the old images
            editedAt: new Date(),       // Save the timestamp
        });


        post.author = author;
        post.content = content;
        post.visibility = visibility;
        post.group = group;
        post.images = images;  // Set the updated images
        post.edited = true; 

       await post.save();

        res.status(200).json(updatedPost);

    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(400).json({ message: 'Error updating post' });
    }
};

// Delete a post by ID
const deletePost = async (req, res) => {
    try {

        const postId = req.query.postId;
        const deletedPost = await Post.findOneAndDelete( { id: postId });
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

const giveReact = async (req, res)=>{
    try{
        const { id, currentUser } = req.body.data;
        console.log(id, currentUser)
        const postId = id.postId;
        console.log(postId)
        // Find the post by id and update the reaction by 1
        const result = await Post.findOneAndUpdate(
            { id: postId }, // Find the document with the specified _id
            { 
                $inc: { reactions: 1 }, // Increment the reactions field by 1
                $push: { reactBy: currentUser } // Push currentUser into reactBy array
            },
            { new: true } // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: 'Reaction plus 1' });
        } else {
            console.log("Post not found")
            res.status(404).json({ message: `Cannot find this post` });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Sever error handling reaction"})
    }
}

const deleteReact = async (req, res) =>{
    try{
        const { id, currentUser } = req.body.data;
        const postId = id.postId;
        // Find the post by id and update the reaction by 1
        const result = await Post.findOneAndUpdate(
            { id: postId }, // Find the document with the specified _id
            { 
                $inc: { reactions: -1 }, // Decrement the reactions field by 1
                $pull: { reactBy: currentUser } // Remove currentUser from reactBy array
            },
            { new: true } // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: 'Reaction minus 1' });
        } else {
            console.log("Post not found")
            res.status(404).json({ message: `Cannot find this post` });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Sever error handling reaction"})
    }
}

const getPostOfUser = async (req, res) => {
    try {
        // Assuming the query parameter is named 'username'
        const { username } = req.query;
        console.log(username);
        
        // Ensure that the query is passed correctly
        const posts = await Post.find({ author: username });

        const result = await Promise.all(posts.map(async (post) => {
            const user = await User.findOne({ username: post.author }); 
            return {
                fullname: user.fullName,
                avatar: user.avatar,
                post: post
            };
        }));
        
        res.json(result);
    }
    catch (error) {
        console.error('Error in getPostOfUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    // getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    isFriend,
    getPostsForUser,
    giveReact,
    deleteReact,
    createPostInGroup,
    createPostInGroup,
    getPostOfUser
};
