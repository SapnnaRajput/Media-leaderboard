import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card';

const topJournalists = [
  {
    id: 1,
    name: 'Sarah Chen',
    expertise: 'Technology & Startups',
    impact: 'High',
    articles: '120+',
    image: '/assets/sarah-chen.jpg'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    expertise: 'Business & Finance',
    impact: 'Very High',
    articles: '85+',
    image: '/assets/michael-rodriguez.jpg'
  },
  {
    id: 3,
    name: 'Emma Thompson',
    expertise: 'Fashion & Lifestyle',
    impact: 'High',
    articles: '95+',
    image: '/assets/emma-thompson.jpg'
  }
];

export const TopJournalists = () => {
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
          <h2 className="text-3xl font-bold mb-4">Top Performing Journalists</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Leading journalists driving brand growth and engagement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topJournalists.map((journalist, index) => (
            <motion.div
              key={journalist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="flex items-center mb-4">
                  <img 
                    src={journalist.image} 
                    alt={journalist.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{journalist.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{journalist.expertise}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Impact:</span>
                    <span className="text-sm font-medium">{journalist.impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Articles:</span>
                    <span className="text-sm font-medium">{journalist.articles}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 btn btn-primary">
                    View Profile
                  </button>
                  <button className="flex-1 btn btn-secondary">
                    Contact
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
