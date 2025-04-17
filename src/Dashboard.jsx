// src/pages/Dashboard.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { tools } from './toolsData';

const Dashboard = ({ selectedCategory }) => {
  // Filter tools by category
  const filteredTools =
    selectedCategory === 'All'
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        {selectedCategory === 'All' ? 'All Tools' : selectedCategory}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map((tool) => (
          <div
            key={tool.title}
            className="bg-white rounded-2xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {tool.title}
            </h2>
            <p className="text-gray-600 mb-6">{tool.description}</p>
            {tool.route ? (
              <NavLink
                to={tool.route}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300 hover:bg-blue-700"
              >
                Open
              </NavLink>
            ) : (
              <button
                onClick={() => alert(`Opening ${tool.title}...`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300 hover:bg-blue-700"
              >
                Open
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
