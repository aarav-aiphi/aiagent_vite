// src/services/wordpress.js
import axios from 'axios';

// Update this to your actual WP site URL
// If your WordPress is at http://localhost/my-react-blog/
// The REST API base is usually /wp-json/wp/v2
const API_URL = 'http://localhost/blog/wp-json/wp/v2';

// Fetch all published posts
export const fetchPosts = async () => {
  try {
    // _embed includes featured images, authors, etc.
    const response = await axios.get(`${API_URL}/posts?_embed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Fetch a single post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}?_embed`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return null;
  }
};
