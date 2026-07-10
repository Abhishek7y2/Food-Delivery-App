import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './ExploreFood.css';

const categories = [
  "All", "Biryani", "Burger", "Cake", "Ice Cream", "Pizza", "Rolls", "Salad"
];

const ExploreFood = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <div className="explore-page-wrapper">
      <div className="container">
        
        {/* Hero Section */}
        <div className="explore-hero fade-in-up">
          <h1 className="explore-hero-title">
            Find Your <span className="text-gradient">Cravings</span>
          </h1>
          <p className="explore-hero-subtitle">
            Search through our extensive menu of premium dishes or filter by your favorite categories to find exactly what you're looking for.
          </p>
        </div>

        {/* Controls Section */}
        <div className="explore-controls-container">
          
          {/* Premium Search Bar */}
          <div className="premium-search-wrapper">
            <input 
              type="text" 
              className="premium-search-input" 
              placeholder="Search your favorite dish..." 
              onChange={(e) => setSearchText(e.target.value)} 
              value={searchText}
            />
            <i className="bi bi-search premium-search-icon"></i>
          </div>

          {/* Premium Category Pills */}
          <div className="premium-category-filters">
            {categories.map((cat, index) => (
              <button 
                key={index}
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Results Header */}
        <div className="explore-results-header">
          <h2 className="explore-results-title">
            {category === 'All' ? 'Our Full Menu' : `${category} Menu`}
          </h2>
          {searchText && (
            <span className="explore-results-count">Searching: "{searchText}"</span>
          )}
        </div>

      </div>
      
      {/* Food Display Container */}
      <FoodDisplay category={category} searchText={searchText} />
    </div>
  )
}

export default ExploreFood;