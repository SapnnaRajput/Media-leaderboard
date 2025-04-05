import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card';

const featuredMedia = [
  {
    id: 1,
    name: 'TechCrunch',
    category: 'Technology',
    impact: 'High',
    recentCoverage: '5 trending startups',
    image: '/assets/techcrunch-logo.png'
  },
  {
    id: 2,
    name: 'Forbes',
    category: 'Business',
    impact: 'Very High',
    recentCoverage: '3 unicorn features',
    image: '/assets/forbes-logo.png'
  },
  {
    id: 3,
    name: 'Vogue',
    category: 'Fashion',
    impact: 'High',
    recentCoverage: '4 brand launches',
    image: '/assets/vogue-logo.png'
  }
];

export const FeaturedMedia = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Media Outlets</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Top performing media outlets driving brand growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMedia.map((media, index) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="flex items-center mb-4">
                  <img 
                    src={media.image} 
                    alt={media.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{media.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{media.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Impact:</span>
                    <span className="text-sm font-medium">{media.impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recent Coverage:</span>
                    <span className="text-sm font-medium">{media.recentCoverage}</span>
                  </div>
                </div>
                <button className="mt-4 w-full btn btn-primary">
                  View Details
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
