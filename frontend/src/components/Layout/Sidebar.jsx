import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Media Outlets', href: '/media', icon: '📰' },
  { name: 'Journalists', href: '/journalists', icon: '👨‍💻' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Campaigns', href: '/campaigns', icon: '🎯' },
  { name: 'Settings', href: '/settings', icon: '⚙️' }
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">ML</span>
            {!isCollapsed && (
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                MediaLeader
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400">👤</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  john@example.com
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
    </motion.aside>
  );
};
