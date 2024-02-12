import React from 'react';
import SideNav from '@/app/ui/explore/sidenav';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
      © 2024 Tibet Duman, Uncountable Front-End Project
    </footer>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
