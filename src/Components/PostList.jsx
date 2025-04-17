// src/components/PostList.js
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../Services/wordpress';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-gray-600">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Blog Posts</h1>
      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {post._embedded['wp:featuredmedia'] && (
              <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post.title.rendered}
                className="w-full h-60 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div
                className="text-gray-600 mb-6"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <Link
                to={`/post/${post.id}`}
                className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-200"
              >
                Read More &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
