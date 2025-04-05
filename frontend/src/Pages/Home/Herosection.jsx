import React from 'react';
import { SearchBar } from '../../components/common/SearchBar';

export const HeroSection = () => {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect with Top Media & Journalists
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover and collaborate with the most influential media outlets and journalists in your industry.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
};
