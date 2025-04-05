import React from 'react';
import { motion } from 'framer-motion';

const quickFilters = [
  {
    id: 'trending',
    label: 'Trending Now',
    icon: '🔥',
    description: 'Most popular media and journalists this week'
  },
  {
    id: 'high-impact',
    label: 'High Impact',
    icon: '🚀',
    description: 'Top performing media outlets and journalists'
  },
  {
    id: 'new-rising',
    label: 'New & Rising',
    icon: '🌟',
    description: 'Emerging journalists and media outlets'
  },
  {
    id: 'verified',
    label: 'Verified',
    icon: '✅',
    description: 'Verified journalists and media outlets'
  }
];

export const QuickFilters = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Quick Filters</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick access to popular categories and filters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickFilters.map((filter, index) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="text-3xl mb-4">{filter.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{filter.label}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {filter.description}
                </p>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
