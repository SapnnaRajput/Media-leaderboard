import React from 'react';
import { HeroSection } from './Herosection.jsx';
import { FeaturedMedia } from './FeaturedMedia';
import { TopJournalists } from './TopJournalists';
import { SearchFunctionality } from './SearchFunctionality';
import { QuickFilters } from './QuickFilters';

export const Home = () => {
  return (
    <main>
      <HeroSection />
      {/* <SearchFunctionality /> */}
      {/* <QuickFilters />
      <FeaturedMedia />
      <TopJournalists /> */}
    </main>
  );
}; 