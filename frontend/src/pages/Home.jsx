import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Camera, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { fetchFeaturedProducts, fetchTrendingProducts, fetchCategories, featuredProducts, trendingProducts } = useStore();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTrendingProducts();
    fetchCategories();
  }, []);

  const categories = [
    { name: 'Tops', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', path: '/products?category=tops' },
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', path: '/products?category=dresses' },
    { name: 'Bottoms', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', path: '/products?category=bottoms' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', path: '/products?category=shoes' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', path: '/products?category=accessories' },
    { name: 'Ethnic', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', path: '/products?category=ethnic' },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Perfect Style</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience fashion like never before with our virtual try-on technology. 
                Shop the latest trends and see how clothes look on you before you buy.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary flex items-center space-x-2 text-lg px-8 py-3">
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/tryon" className="btn-secondary flex items-center space-x-2 text-lg px-8 py-3">
                  <Camera className="w-5 h-5" />
                  <span>Try On</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"
                alt="Fashion"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">New Arrivals</p>
                    <p className="font-semibold">500+ Styles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹500' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30 day return policy' },
              { icon: Star, title: 'Top Quality', desc: 'Premium materials' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of fashion categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.path}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <p className="text-gray-600">Handpicked just for you</p>
              </div>
              <Link to="/products?featured=true" className="hidden md:flex items-center space-x-2 text-primary hover:underline">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Link to="/products?featured=true" className="md:hidden flex justify-center mt-8">
              <button className="btn-primary">View All Featured</button>
            </Link>
          </div>
        </section>
      )}

      {/* Virtual Try-On Banner */}
      <section className="py-16 bg-gradient-to-r from-secondary to-teal-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Virtual Try-On</h2>
              <p className="text-xl mb-8 opacity-90">
                Experience the future of shopping! Upload your photo or use your camera 
                to see how clothes look on you before purchasing.
              </p>
              <Link to="/tryon" className="inline-flex items-center space-x-2 bg-white text-secondary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5" />
                <span>Try It Now</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300" alt="Try-on" className="rounded-xl shadow-lg" />
              <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300" alt="Fashion" className="rounded-xl shadow-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trending Now</h2>
                <p className="text-gray-600">What's hot this season</p>
              </div>
              <Link to="/products?trending=true" className="hidden md:flex items-center space-x-2 text-primary hover:underline">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in Style</h2>
          <p className="text-gray-400 mb-8">Subscribe to get exclusive offers and the latest trends</p>
          <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none"
            />
            <button type="submit" className="btn-primary px-8">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
