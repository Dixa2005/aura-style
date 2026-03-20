import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold">Aura Style</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate fashion destination with virtual try-on technology. Experience fashion like never before.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link to="/products?featured=true" className="text-gray-400 hover:text-primary transition-colors">Featured</Link></li>
              <li><Link to="/products?trending=true" className="text-gray-400 hover:text-primary transition-colors">Trending</Link></li>
              <li><Link to="/tryon" className="text-gray-400 hover:text-primary transition-colors">Virtual Try-On</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=tops" className="text-gray-400 hover:text-primary transition-colors">Tops</Link></li>
              <li><Link to="/products?category=bottoms" className="text-gray-400 hover:text-primary transition-colors">Bottoms</Link></li>
              <li><Link to="/products?category=dresses" className="text-gray-400 hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link to="/products?category=outerwear" className="text-gray-400 hover:text-primary transition-colors">Outerwear</Link></li>
              <li><Link to="/products?category=shoes" className="text-gray-400 hover:text-primary transition-colors">Shoes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>123 Fashion Street, Mumbai, India</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@aurastyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Aura Style. All rights reserved. Made for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
