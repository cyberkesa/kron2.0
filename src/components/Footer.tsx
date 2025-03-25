import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Kron2.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
