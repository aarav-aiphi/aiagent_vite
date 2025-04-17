// src/Components/AgentList.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaRegBookmark } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import custom styles

import { useSelector, useDispatch } from 'react-redux';
import { fetchAgents, updateLikeCount, updateSavedByCount } from '../redux/agentsSlice'; // Import actions

const AGENTS_PER_PAGE = 20;

// Helper function to get a range of pages around the current page
const getPaginationPages = (currentPage, totalPages, pageWindowSize) => {
  // The first page we want to show
  let startPage = Math.max(1, currentPage - Math.floor(pageWindowSize / 2));
  // The last page we want to show
  let endPage = Math.min(totalPages, startPage + pageWindowSize - 1);

  // Adjust startPage if we don't get the full window
  // (e.g., near the last pages)
  if (endPage - startPage + 1 < pageWindowSize) {
    startPage = Math.max(1, endPage - pageWindowSize + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
};

export const AgentList = ({ filters, setAgentListLoading }) => {
  const [agents, setAgents] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const agentListRef = useRef(null);

  // Access Redux state
  const dispatch = useDispatch();
  const agentsState = useSelector((state) => state.agents);
  const { agents: fetchedAgents, likeCounts, saveCounts, status, error } = agentsState;

  // Fetch Agents from API (Redux Thunk)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAgentListLoading(true); // Start loading
        await dispatch(fetchAgents()).unwrap();
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setAgentListLoading(false); // Stop loading
      }
    };
    fetchData();
  }, [dispatch, setAgentListLoading]);

  // Once agents are fetched, update local states
  useEffect(() => {
    if (status === 'succeeded') {
      setAgents(fetchedAgents || []);
      const sortedAgents = [...fetchedAgents].sort((a, b) => b.likes - a.likes);
      setTopAgents(sortedAgents.slice(0, 10)); // Get top 10 agents by likes
    }
  }, [status, fetchedAgents]);

  // Like Handler
  const handleLike = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const url = `https://backend-1-sval.onrender.com/api/users/like/${agentId}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Agent liked successfully!');
        dispatch(updateLikeCount({ agentId, likeCount: response.data.agent.likes }));
      }
      if (response.status === 201) {
        toast.success('Like removed successfully!');
      }

    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'You have already liked this agent'
      ) {
        toast.info('You have already liked this agent!');
      } else {
        console.error('Error liking agent:', error);
      }
    }
  };

  // Wishlist Handler
  const handleWishlist = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const url = `https://backend-1-sval.onrender.com/api/users/wishlist/${agentId}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Agent added to wishlist!');
        dispatch(updateSavedByCount({ agentId, savedByCount: response.data.agent.savedByCount }));
      } else if (response.status === 201) {
        toast.success('Agent removed from wishlist!');
        dispatch(updateSavedByCount({ agentId, savedByCount: response.data.agent.savedByCount }));
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Filtering Logic
  const filteredAgents = fetchedAgents.filter((agent) => {
    return (
      (filters.category === 'Category' || agent.category === filters.category) &&
      (filters.industry === 'Industry' || agent.industry === filters.industry) &&
      (filters.pricingModel === 'Pricing' || agent.price === filters.pricingModel) &&
      (filters.accessModel === 'Access' || agent.accessModel === filters.accessModel)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE);

  const getCurrentPageAgents = () => {
    const start = (currentPage - 1) * AGENTS_PER_PAGE;
    const end = start + AGENTS_PER_PAGE;
    return filteredAgents.slice(start, end);
  };

  const scrollToTop = () => {
    if (agentListRef.current) {
      agentListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  // Decide how many page links to show at once
  const PAGE_WINDOW_SIZE = 6; // e.g., show at most 6 page links at a time
  const paginationPages = getPaginationPages(currentPage, totalPages, PAGE_WINDOW_SIZE);

  return (
    <div className="mt-9 mx-auto max-h-screen overflow-y-auto">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-primaryBlue" ref={agentListRef}>
          Agents
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, duration: 0.6 }}
      >
        {getCurrentPageAgents().length > 0 ? (
          getCurrentPageAgents().map((agent) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Link to={`/agent/${agent._id}`}>
                <div className="p-4 rounded-lg flex items-start group transition-all duration-300 agent-card">
                  <div className="flex-shrink-0">
                    <img
                      src={agent.logo || 'https://via.placeholder.com/50'}
                      alt={agent.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-primaryBlue group-hover:text-blue-900 transition-colors duration-300">
                        {agent.name}
                      </h3>
                      <span className="text-sm text-gray-500">{agent.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{agent.tagline || 'No description available.'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {agent.tags && agent.tags.length > 0 ? (
                        agent.tags.map((tag, index) => (
                          <span key={index} className="bg-white text-blue-900 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No tags available</span>
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      <button
                        className="flex items-center text-primaryBlue hover:text-blue-900 transition-all"
                        onClick={(event) => handleLike(event, agent._id)}
                        aria-label={`Like agent ${agent.name}`}
                      >
                        <FaThumbsUp className="mr-2" /> {likeCounts[agent._id] || 0}
                      </button>
                      <button
                        className="flex items-center text-primaryBlue hover:text-blue-900 transition-all ml-4"
                        onClick={(event) => handleWishlist(event, agent._id)}
                        aria-label={`Add or remove agent ${agent.name} from wishlist`}
                      >
                        <FaRegBookmark className="mr-2" /> {saveCounts[agent._id] || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600"
          >
            No agents found.
          </motion.p>
        )}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-2 border rounded-full ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} text-primaryBlue border-primaryBlue`}
            aria-label="Previous Page"
          >
            &lt;
          </button>

          <div className="flex space-x-2 mx-4">
            {paginationPages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`p-2 rounded-full border ${
                  currentPage === page ? 'bg-primaryBlue text-white' : 'text-primaryBlue border-primaryBlue'
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 border rounded-full ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            } text-primaryBlue border-primaryBlue`}
            aria-label="Next Page"
          >
            &gt;
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AgentList;
