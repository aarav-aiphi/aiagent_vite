// src/components/Sidebar.jsx
import React from 'react';
import { categories } from './toolsData';

const Sidebar = ({ selectedCategory, onCategorySelect }) => {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-2xl p-6">
      <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wider">
        Categories
      </h2>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onCategorySelect(category)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition transform duration-300
                ${
                  selectedCategory === category
                    ? 'bg-white text-indigo-600 font-bold shadow-lg scale-105'
                    : 'bg-transparent hover:bg-white hover:bg-opacity-20'
                }
              `}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
