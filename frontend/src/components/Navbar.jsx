import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu, X, Camera } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  const { user, isAuthenticated, cart, logout } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes', 'activewear', 'ethnic'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aura Style
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="text-gray-700 hover:text-primary capitalize transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/tryon" className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary">
              <Camera className="w-5 h-5" />
              <span className="text-sm">Try-On</span>
            </Link>
            
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary">
              <Heart className="w-5 h-5" />
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{user?.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:block btn-primary text-sm">
                Login
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="py-4 space-y-2">
              <form onSubmit={handleSearch} className="px-4 pb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </form>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 capitalize"
                  onClick={() => setIsOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <Link
                to="/tryon"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Virtual Try-On
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
