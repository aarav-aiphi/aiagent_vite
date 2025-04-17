// src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ChatbotPage from './ChatbotPage';

function Agbuilder() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => setSelectedCategory(cat)}
      />

      {/* Main content area */}
      <div className="flex-1">
        
            <Dashboard selectedCategory={selectedCategory} />
        
      </div>
    </div>
  );
}

export default Agbuilder;
