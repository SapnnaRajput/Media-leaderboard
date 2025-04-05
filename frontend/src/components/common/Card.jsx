import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};
