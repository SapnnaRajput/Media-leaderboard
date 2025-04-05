import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { useState } from 'react';

const searchCategories = [
  { id: 'brand', label: 'Brand' },
  { id: 'journalist', label: 'Journalist' },
  { id: 'media', label: 'Media Outlet' },
  { id: 'category', label: 'Category' }
];

const timeframes = [
  { id: '7days', label: 'Last 7 days' },
  { id: '30days', label: 'Last 30 days' },
  { id: '90days', label: 'Last 90 days' },
  { id: 'year', label: 'Last year' }
];

const regions = [
  { id: 'global', label: 'Global' },
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' }
];

export const SearchFunctionality = () => {
  const [timeframe, setTimeframe] = useState('7days');
  const [region, setRegion] = useState('global');
  const [category, setCategory] = useState('tech');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Search</h2>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {searchCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {category.label}
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Filter
                label="Timeframe"
                options={timeframes}
                value={timeframe}
                onChange={setTimeframe}
                className="w-full"
              />
              <Filter
                label="Region"
                options={regions}
                value={region}
                onChange={setRegion}
                className="w-full"
              />
              <Filter
                label="Category"
                options={[
                  { id: 'tech', label: 'Technology' },
                  { id: 'fashion', label: 'Fashion' },
                  { id: 'health', label: 'Health' },
                  { id: 'finance', label: 'Finance' }
                ]}
                value={category}
                onChange={setCategory}
                className="w-full"
              />
            </div>

            <div className="mt-8">
              <SearchBar
                onSearch={handleSearch}
                className="w-full"
              />
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary px-8"
              >
                Search
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
