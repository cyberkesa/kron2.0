import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, userName } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">Kron2.0</Link>

        {/* Десктопное меню */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>Главная</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>Каталог</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>О нас</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>Контакты</NavLink>
        </nav>

        {/* Иконки корзины и аккаунта + бургер */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

		  {userName ? (
  <Link
    to="/profile"
    className="inline-flex items-center text-gray-700 hover:text-gray-900"
  >
    <UserCircleIcon className="h-6 w-6 mr-1" />
    {userName}
  </Link>
) : (
  <Link
    to="/login"
    className="text-gray-600 hover:text-gray-900"
  >
    <UserCircleIcon className="h-6 w-6" />
  </Link>
)}


          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="px-4 py-2 space-y-2">
            {['/', '/catalog', '/about', '/contact'].map(path => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'block text-gray-900 font-semibold' : 'block text-gray-600 hover:text-gray-900'
                }
              >
                {{ '/': 'Главная', '/catalog': 'Каталог', '/about': 'О нас', '/contact': 'Контакты' }[path]}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
