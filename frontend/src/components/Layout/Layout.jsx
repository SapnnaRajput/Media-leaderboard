import React from 'react';
import { Header } from './Header';
// import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 w-full bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
