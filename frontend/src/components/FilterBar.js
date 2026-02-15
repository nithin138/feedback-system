import React from 'react';

const FilterBar = ({ filter, onFilterChange }) => {
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'course', label: 'Course' },
    { value: 'facility', label: 'Facility' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'highestRated', label: 'Highest Rated' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Category
          </label>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Sort By
          </label>
          <select
            value={filter.sort}
            onChange={(e) => onFilterChange({ ...filter, sort: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
