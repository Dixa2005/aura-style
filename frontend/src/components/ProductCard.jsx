import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Camera } from 'lucide-react';
import useStore from '../store/useStore';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useStore();
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      addToCart(product._id, 1, product.sizes?.[0], product.colors?.[0]?.name);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleTryOn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500';

  return (
    <Link 
      to={`/products/${product._id}`}
      className="card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageError ? fallbackImage : product.images?.[0] || fallbackImage}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm font-semibold">
            -{discount}%
          </div>
        )}

        {product.trending && (
          <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
            Trending
          </div>
        )}

        {/* Action buttons */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleWishlist}
            className={`p-3 rounded-full transition-colors ${isWishlisted ? 'bg-primary text-white' : 'bg-white text-gray-800 hover:bg-primary hover:text-white'}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleAddToCart}
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleTryOn}
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.numReviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Color options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1 mt-3">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex || '#ccc' }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
