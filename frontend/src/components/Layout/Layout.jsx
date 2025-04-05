import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
