import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const { products, fetchProducts, categories, fetchCategories, loading } = useStore();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt',
    colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
    featured: searchParams.get('featured') === 'true',
    trending: searchParams.get('trending') === 'true'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        if (Array.isArray(filters[key]) && filters[key].length > 0) {
          params[key] = filters[key].join(',');
        } else if (!Array.isArray(filters[key])) {
          params[key] = filters[key];
        }
      }
    });
    setSearchParams(params);
    fetchProducts(params);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '-createdAt',
      colors: [],
      sizes: [],
      featured: false,
      trending: false
    });
    setSearchParams({});
  };

  const colors = ['White', 'Black', 'Blue', 'Red', 'Pink', 'Green', 'Yellow', 'Brown', 'Grey', 'Navy'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Highest Rated' },
    { value: '-numReviews', label: 'Most Popular' }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {filters.search && `Search: "${filters.search}"`}
              {filters.category && `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`}
              {filters.featured && 'Featured Products'}
              {filters.trending && 'Trending Products'}
              {!filters.search && !filters.category && !filters.featured && !filters.trending && 'All Products'}
            </h1>
            <p className="text-gray-600 mt-1">{products.length} products found</p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="hidden md:flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : 'hidden'} md:block md:relative md:w-64 md:bg-transparent`}>
            <div className="md:w-64">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Clear Filters */}
              {(filters.category || filters.gender || filters.minPrice || filters.search || filters.featured || filters.trending) && (
                <button
                  onClick={clearFilters}
                  className="w-full mb-6 text-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => handleFilterChange('category', cat)}
                        className="mr-2"
                      />
                      <span className="capitalize">{cat}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="mr-2"
                    />
                    <span>All Categories</span>
                  </label>
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="space-y-2">
                  {['male', 'female', 'unisex'].map(g => (
                    <label key={g} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={filters.gender === g}
                        onChange={() => handleFilterChange('gender', g)}
                        className="mr-2"
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      checked={filters.gender === ''}
                      onChange={() => handleFilterChange('gender', '')}
                      className="mr-2"
                    />
                    <span>All</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full input-field"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleArrayFilterChange('colors', color)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        filters.colors.includes(color)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleArrayFilterChange('sizes', size)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        filters.sizes.includes(size)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured & Trending */}
              <div className="mb-6">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.trending}
                    onChange={(e) => handleFilterChange('trending', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Trending Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">No products found</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
