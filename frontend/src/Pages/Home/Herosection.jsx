import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const [category, setCategory] = useState("");
  const [journalist, setJournalist] = useState("");
  const [viewsRange, setViewsRange] = useState("");
  const [conversionsRange, setConversionsRange] = useState("");
  const [ctrRange, setCtrRange] = useState("");

  const resetFilters = () => {
    setCategory("");
    setJournalist("");
    setViewsRange("");
    setConversionsRange("");
    setCtrRange("");
  };

  const data = [
    {
      rank: 1,
      outlet: "TechCrunch",
      journalist: "Bob ",
      category: "Tech",
      views: 1200000,
      conversions: 45000,
      ctr: 3.7,
      brand: "StartupX",
      article: "AI Disrupting Retail",
      link: "https://example.com/article1",
      region: "Global",
      type: "Organic",
    },
    {
      rank: 2,
      outlet: "Forbes",
      journalist: "Sapna",
      category: "Finance",
      views: 980000,
      conversions: 32000,
      ctr: 3.2,
      brand: "FinTechPro",
      article: "How Unicorns Grow",
      link: "https://example.com/article2",
      region: "USA",
      type: "Boosted",
    },
    {
      rank: 3,
      outlet: "The Verge",
      journalist: "Peter",
      category: "Technology",
      views: 860000,
      conversions: 28000,
      ctr: 3.1,
      brand: "GadgetFlow",
      article: "Future of Wearables",
      link: "https://example.com/article3",
      region: "Global",
      type: "Organic",
    },
    {
      rank: 4,
      outlet: "Bloomberg",
      journalist: "Nithin",
      category: "Business",
      views: 1100000,
      conversions: 40000,
      ctr: 3.6,
      brand: "BizBoost",
      article: "Market Trends 2025",
      link: "https://example.com/article4",
      region: "Europe",
      type: "Boosted",
    },
    {
      rank: 5,
      outlet: "BBC",
      journalist: "Sara",
      category: "World News",
      views: 1800000,
      conversions: 55000,
      ctr: 3.0,
      brand: "NewsConnect",
      article: "Elections Around the World",
      link: "https://example.com/article5",
      region: "Global",
      type: "Organic",
    },
  ];

  const filteredData = data.filter((item) => {
    const itemViews = item.views;
    const itemConversions = item.conversions;
    const itemCtr = item.ctr;
    
    let viewsMatch = true;
    if (viewsRange === "1M+") {
      viewsMatch = itemViews >= 1000000;
    } else if (viewsRange === "500K-1M") {
      viewsMatch = itemViews >= 500000 && itemViews < 1000000;
    } else if (viewsRange === "<500K") {
      viewsMatch = itemViews < 500000;
    }
    
    let conversionsMatch = true;
    if (conversionsRange === "40K+") {
      conversionsMatch = itemConversions >= 40000;
    } else if (conversionsRange === "20K-40K") {
      conversionsMatch = itemConversions >= 20000 && itemConversions < 40000;
    } else if (conversionsRange === "<20K") {
      conversionsMatch = itemConversions < 20000;
    }
    
    let ctrMatch = true;
    if (ctrRange === "3.5%+") {
      ctrMatch = itemCtr >= 3.5;
    } else if (ctrRange === "3.0%-3.5%") {
      ctrMatch = itemCtr >= 3.0 && itemCtr < 3.5;
    } else if (ctrRange === "<3.0%") {
      ctrMatch = itemCtr < 3.0;
    }

    return (
      (category === "" || item.category.toLowerCase().includes(category.toLowerCase())) &&
      (journalist === "" || item.journalist.toLowerCase().includes(journalist.toLowerCase())) &&
      viewsMatch &&
      conversionsMatch &&
      ctrMatch
    );
  });

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const heroText = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen px-6 py-3 bg-gradient-to-br from-blue-900 via-purple-800 to-pink-600 text-white">
      {/* Add global styles for select dropdowns */}
      <style>{`
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em;
        }
        
        select option {
          background-color: #1e1b4b; /* dark blue */
          color: white;
        }
        
        select:focus option:checked {
          background: linear-gradient(to right, #4338ca, #db2777);
        }
      `}</style>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroText}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold leading-tight drop-shadow-xl mb-4">
          Discover the Media That Moves the World
        </h1>
        <p className="text-lg md:text-xl text-pink-200 font-light">
          Dive into real-time insights on top-performing journalists and media outlets.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <input
          type="text"
          placeholder="🔍 Search by Brand, Category, Media Outlet, Conversion Type"
          className="w-full sm:max-w-lg px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-white/70 border border-white/20 shadow-lg focus:outline-none"
        />
        <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg px-6 py-3 font-semibold transition-all">
          Search
        </button>
      </motion.div>

      {/* Filter Section + Reset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-5 flex flex-wrap justify-center items-center gap-4"
      >
        {/* Journalist Search */}
        <div className="relative">
          <input
            type="text"
            value={journalist}
            onChange={(e) => setJournalist(e.target.value)}
            placeholder="Search Journalist"
            className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow focus:outline-none"
          />
          {journalist && (
            <button
              onClick={() => setJournalist("")}
              className="absolute right-2 top-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 pr-8 rounded-xl bg-blue/10 backdrop-blur-md text-white border border-white/20 shadow focus:outline-none w-full"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Finance">Finance</option>
            <option value="Business">Business</option>
            <option value="World News">World News</option>
          </select>
        </div>

        {/* Views Range Dropdown */}
        <div className="relative">
          <select
            value={viewsRange}
            onChange={(e) => setViewsRange(e.target.value)}
            className="px-4 py-2 pr-8 rounded-xl bg-blue/10 backdrop-blur-md text-white border border-white/20 shadow focus:outline-none w-full"
          >
            <option value="">All View Ranges</option>
            <option value="1M+">1M+ Views</option>
            <option value="500K-1M">500K-1M Views</option>
            <option value="<500K">{"<500K Views"}</option>
          </select>
        </div>

        {/* Conversions Range Dropdown */}
        <div className="relative">
          <select
            value={conversionsRange}
            onChange={(e) => setConversionsRange(e.target.value)}
            className="px-4 py-2 pr-8 rounded-xl bg-blue/10 backdrop-blur-md text-white border border-white/20 shadow focus:outline-none w-full"
          >
            <option value="">All Conversion Ranges</option>
            <option value="40K+">40K+ Conversions</option>
            <option value="20K-40K">20K-40K Conversions</option>
            <option value="<20K">{"<20K Conversions"}</option>
          </select>
        </div>

        {/* CTR Range Dropdown */}
        <div className="relative">
          <select
            value={ctrRange}
            onChange={(e) => setCtrRange(e.target.value)}
            className="px-4 py-2 pr-8 rounded-xl bg-blue/10 backdrop-blur-md text-white border border-white/20 shadow focus:outline-none w-full"
          >
            <option value="">All CTR Ranges</option>
            <option value="3.5%+">3.5%+ CTR</option>
            <option value="3.0%-3.5%">3.0%-3.5% CTR</option>
            <option value="<3.0%">{"<3.0% CTR"}</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="bg-blue/100 border border-white/20 text-white px-5 py-2 rounded-xl hover:bg-white/20 transition"
        >
          Reset Filters
        </button>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 overflow-x-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 text-white uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Media Outlet</th>
                <th className="px-6 py-3">Top Journalist</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Total Views</th>
                <th className="px-6 py-3">Conversions</th>
                <th className="px-6 py-3">Avg. CTR</th>
                <th className="px-6 py-3">Top Brand Boosted</th>
                <th className="px-6 py-3">Top Article</th>
                <th className="px-6 py-3">Article Link</th>
                <th className="px-6 py-3">Audience Region</th>
                <th className="px-6 py-3">Coverage Type</th>
              </tr>
            </thead>
            <tbody className="bg-white/5">
              <AnimatePresence>
                {filteredData.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-white/10 hover:bg-white/10 transition-all"
                  >
                    <td className="px-6 py-4 text-center">{item.rank}</td>
                    <td className="px-6 py-4">{item.outlet}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{item.journalist}</span>
                        <Link
                          to={`/profile/${item.journalist}`}
                          className="text-blue-300 hover:underline text-sm mt-1"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{formatNumber(item.views)}</td>
                    <td className="px-6 py-4">{formatNumber(item.conversions)}</td>
                    <td className="px-6 py-4">{item.ctr}%</td>
                    <td className="px-6 py-4">{item.brand}</td>
                    <td className="px-6 py-4">{item.article}</td>
                    <td className="px-6 py-4">
                      <a
                        className="text-blue-300 hover:underline"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-6 py-4">{item.region}</td>
                    <td className="px-6 py-4">{item.type}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};