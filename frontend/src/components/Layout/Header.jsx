import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">MediaLeader</span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-6"
            >
              <Link to="/media" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Media
              </Link>
              <Link to="/journalists" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Journalists
              </Link>
              <Link to="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Search
              </Link>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Dashboard
              </Link>
            </motion.div>
          </nav>

          {/* User Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center space-x-4"
          >
            <button className="btn btn-secondary">
              Sign In
            </button>
            <button className="btn btn-primary">
              Sign Up
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
