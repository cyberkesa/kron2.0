import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Логотип */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Kron2.0
        </Link>
        {/* Десктопное меню */}
        <nav className="hidden md:flex space-x-4">
          {['/', '/catalog', '/cart', '/about', '/contact'].map((path) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }
            >
              {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
            </NavLink>
          ))}
        </nav>
        {/* Кнопка для мобильного меню */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['/', '/catalog', '/cart', '/about', '/contact'].map((path) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'block text-gray-900 font-semibold'
                    : 'block text-gray-600 hover:text-gray-900'
                }
              >
                {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
              </NavLink>
            ))}
          </div>
          <div className="px-2 pb-3">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
