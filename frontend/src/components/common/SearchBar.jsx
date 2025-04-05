/* eslint-disable no-unused-vars */
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for media outlets, journalists, or topics..."
          className="w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </motion.form>
  );
};
