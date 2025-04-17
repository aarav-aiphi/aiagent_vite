// src/components/PostDetail.js
import React, { useEffect, useState } from 'react';
import { fetchPostById } from '../Services/wordpress';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      const data = await fetchPostById(id);
      setPost(data);
      setLoading(false);
    };
    getPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-red-500">Post not found.</p>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Helmet>
        <title>{post.title.rendered} | My React Blog</title>
        <meta
          name="description"
          content={post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}
        />
       
       
      </Helmet>

      <div className="mb-8">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Posts
        </Link>
      </div>
      <h1
        className="text-4xl font-bold mb-6 text-center text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      {post._embedded && post._embedded['wp:featuredmedia'] && (
        <img
          src={post._embedded['wp:featuredmedia'][0].source_url}
          alt={post.title.rendered}
          className="w-full h-96 object-cover rounded-md mb-8"
          loading="lazy"
        />
      )}
      <div
        className="prose lg:prose-xl mx-auto text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
};

export default PostDetail;
