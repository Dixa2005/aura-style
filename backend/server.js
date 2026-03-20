const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const tryOnRoutes = require('./routes/tryOn');

// Import models
const Product = require('./models/Product');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tryon', tryOnRoutes);

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aura Style API is running' });
});

// Dummy data seeding
const seedDatabase = async () => {
  const count = await Product.countDocuments();
  if (count > 0) return;

  const products = [
    // Tops - Women's
    {
      name: 'Elegant Silk Blouse',
      description: 'Luxurious silk blouse with a classic fit. Perfect for office or evening wear. Features a subtle sheen and comfortable drape.',
      price: 2499,
      originalPrice: 3999,
      images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'],
      category: 'tops',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Pink', hex: '#FFB6C1' }],
      brand: 'Aura Exclusive',
      stock: 45,
      rating: 4.5,
      numReviews: 128,
      featured: true,
      trending: true,
      tags: ['silk', 'formal', 'office'],
      competitors: [
        { name: 'Amazon', url: 'https://amazon.in', price: 2999 },
        { name: 'Nykaa Fashion', url: 'https://nykaafashion.com', price: 2799 },
        { name: 'Myntra', url: 'https://myntra.com', price: 2599 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500'
    },
    {
      name: 'Casual Cotton T-Shirt',
      description: 'Soft, breathable cotton t-shirt for everyday comfort. Relaxed fit with round neck.',
      price: 799,
      originalPrice: 1299,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
      category: 'tops',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#808080' }],
      brand: 'Basic Luxe',
      stock: 120,
      rating: 4.2,
      numReviews: 256,
      featured: false,
      trending: true,
      tags: ['cotton', 'casual', 'comfortable'],
      competitors: [
        { name: 'Amazon', url: 'https://amazon.in', price: 899 },
        { name: 'Flipkart', url: 'https://flipkart.com', price: 749 }
      ]
    },
    {
      name: 'Designer Crop Top',
      description: 'Trendy crop top with unique design patterns. Perfect for parties and casual outings.',
      price: 1299,
      originalPrice: 1999,
      images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'],
      category: 'tops',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Red', hex: '#FF0000' }, { name: 'Black', hex: '#000000' }, { name: 'Gold', hex: '#FFD700' }],
      brand: 'Urban Style',
      stock: 35,
      rating: 4.7,
      numReviews: 89,
      featured: true,
      trending: true,
      tags: ['trendy', 'party', 'designer'],
      competitors: [
        { name: 'Ajio', url: 'https://ajio.com', price: 1499 },
        { name: 'Myntra', url: 'https://myntra.com', price: 1399 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'
    },
    // Bottoms - Women's
    {
      name: 'High-Waist Denim Jeans',
      description: 'Classic high-waist denim jeans with stretch comfort. Flattering fit that goes with everything.',
      price: 1999,
      originalPrice: 2999,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500'],
      category: 'bottoms',
      gender: 'female',
      sizes: ['24', '26', '28', '30', '32', '34'],
      colors: [{ name: 'Blue', hex: '#4169E1' }, { name: 'Black', hex: '#000000' }, { name: 'Light Wash', hex: '#ADD8E6' }],
      brand: 'Denim Co',
      stock: 78,
      rating: 4.6,
      numReviews: 312,
      featured: true,
      trending: false,
      tags: ['denim', 'classic', 'versatile'],
      competitors: [
        { name: 'Levis', url: 'https://levis.in', price: 2499 },
        { name: 'Zara', url: 'https://zara.com', price: 2990 }
      ]
    },
    {
      name: 'Palazzo Pants',
      description: 'Flowing palazzo pants made from premium fabric. Comfortable and stylish for ethnic and western looks.',
      price: 1599,
      originalPrice: 2299,
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'],
      category: 'bottoms',
      gender: 'female',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Maroon', hex: '#800000' }],
      brand: 'Ethnic Elegance',
      stock: 52,
      rating: 4.4,
      numReviews: 167,
      featured: false,
      trending: true,
      tags: ['ethnic', 'comfortable', 'flowing'],
      competitors: [
        { name: 'Amazon', url: 'https://amazon.in', price: 1799 },
        { name: 'Nykaa Fashion', url: 'https://nykaafashion.com', price: 1699 }
      ]
    },
    // Dresses
    {
      name: 'Floral Summer Dress',
      description: 'Beautiful floral print dress perfect for summer days. Light, airy fabric with a flattering silhouette.',
      price: 2999,
      originalPrice: 4499,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'],
      category: 'dresses',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Floral Print', hex: '#FFC0CB' }, { name: 'Blue Floral', hex: '#87CEEB' }],
      brand: 'Summer Vibes',
      stock: 28,
      rating: 4.8,
      numReviews: 203,
      featured: true,
      trending: true,
      tags: ['floral', 'summer', 'casual'],
      competitors: [
        { name: 'Zara', url: 'https://zara.com', price: 3490 },
        { name: 'H&M', url: 'https://hm.com', price: 2799 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'
    },
    {
      name: 'Little Black Dress',
      description: 'The iconic little black dress that every wardrobe needs. Elegant, timeless, and perfect for any occasion.',
      price: 3999,
      originalPrice: 5999,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
      category: 'dresses',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Black', hex: '#000000' }],
      brand: 'Glamour',
      stock: 15,
      rating: 4.9,
      numReviews: 178,
      featured: true,
      trending: false,
      tags: ['classic', 'elegant', 'party'],
      competitors: [
        { name: 'Net-a-Porter', url: 'https://net-a-porter.com', price: 8999 },
        { name: 'Farfetch', url: 'https://farfetch.com', price: 7500 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
    },
    // Outerwear
    {
      name: 'Wool Blend Blazer',
      description: 'Professional wool blend blazer with modern tailoring. Perfect for the modern working woman.',
      price: 4999,
      originalPrice: 6999,
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'],
      category: 'outerwear',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#808080' }],
      brand: 'Business Class',
      stock: 22,
      rating: 4.6,
      numReviews: 94,
      featured: false,
      trending: true,
      tags: ['professional', 'office', 'classic'],
      competitors: [
        { name: 'Zara', url: 'https://zara.com', price: 5990 },
        { name: 'Mango', url: 'https://mango.com', price: 5499 }
      ]
    },
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with modern updates. Versatile piece that works for any season.',
      price: 2499,
      originalPrice: 3499,
      images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500'],
      category: 'outerwear',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Blue', hex: '#4169E1' }, { name: 'Black', hex: '#000000' }],
      brand: 'Denim Co',
      stock: 42,
      rating: 4.5,
      numReviews: 156,
      featured: false,
      trending: true,
      tags: ['denim', 'casual', 'versatile'],
      competitors: [
        { name: 'Levis', url: 'https://levis.in', price: 2999 },
        { name: 'Pepe Jeans', url: 'https://pepejeans.com', price: 2799 }
      ]
    },
    // Men's Products
    {
      name: 'Premium Cotton Formal Shirt',
      description: 'Crisp white formal shirt made from premium cotton. Perfect for office wear with a modern slim fit.',
      price: 1799,
      originalPrice: 2499,
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'],
      category: 'tops',
      gender: 'male',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Blue', hex: '#ADD8E6' }, { name: 'Pink', hex: '#FFB6C1' }],
      brand: 'Executive',
      stock: 65,
      rating: 4.7,
      numReviews: 289,
      featured: true,
      trending: false,
      tags: ['formal', 'office', 'cotton'],
      competitors: [
        { name: 'Louis Philippe', url: 'https://louisphilippe.com', price: 2199 },
        { name: 'Van Heusen', url: 'https://vanheusenindia.com', price: 1999 }
      ]
    },
    {
      name: 'Casual Linen Shirt',
      description: 'Breathable linen shirt perfect for summer. Relaxed fit with a laid-back style.',
      price: 1499,
      originalPrice: 2199,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
      category: 'tops',
      gender: 'male',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Blue', hex: '#4169E1' }],
      brand: 'Summer Comfort',
      stock: 48,
      rating: 4.4,
      numReviews: 134,
      featured: false,
      trending: true,
      tags: ['linen', 'summer', 'casual'],
      competitors: [
        { name: 'Amazon', url: 'https://amazon.in', price: 1699 },
        { name: 'Myntra', url: 'https://myntra.com', price: 1599 }
      ]
    },
    {
      name: 'Slim Fit Chinos',
      description: 'Modern slim fit chinos in versatile colors. Comfortable stretch fabric for all-day wear.',
      price: 1899,
      originalPrice: 2799,
      images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
      category: 'bottoms',
      gender: 'male',
      sizes: ['28', '30', '32', '34', '36'],
      colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }, { name: 'Olive', hex: '#808000' }],
      brand: 'Urban Edge',
      stock: 55,
      rating: 4.5,
      numReviews: 198,
      featured: true,
      trending: true,
      tags: ['chino', 'smart casual', 'versatile'],
      competitors: [
        { name: 'Zara', url: 'https://zara.com', price: 2990 },
        { name: 'H&M', url: 'https://hm.com', price: 1799 }
      ]
    },
    {
      name: 'Classic Fit Jeans',
      description: 'Timeless classic fit jeans with comfortable waist and straight leg.',
      price: 2199,
      originalPrice: 2999,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
      category: 'bottoms',
      gender: 'male',
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: [{ name: 'Blue', hex: '#4169E1' }, { name: 'Black', hex: '#000000' }, { name: 'Dark Blue', hex: '#00008B' }],
      brand: 'Denim Co',
      stock: 72,
      rating: 4.6,
      numReviews: 267,
      featured: false,
      trending: false,
      tags: ['denim', 'classic', 'comfortable'],
      competitors: [
        { name: 'Levis', url: 'https://levis.in', price: 2799 },
        { name: 'Pepe Jeans', url: 'https://pepejeans.com', price: 2499 }
      ]
    },
    {
      name: 'Navy Blue Blazer',
      description: 'Sophisticated navy blazer for formal occasions. Tailored fit with premium fabric.',
      price: 5999,
      originalPrice: 7999,
      images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'],
      category: 'outerwear',
      gender: 'male',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Navy', hex: '#000080' }, { name: 'Black', hex: '#000000' }, { name: 'Grey', hex: '#808080' }],
      brand: 'Executive',
      stock: 18,
      rating: 4.8,
      numReviews: 87,
      featured: true,
      trending: false,
      tags: ['formal', 'classic', 'professional'],
      competitors: [
        { name: 'Brooks Brothers', url: 'https://brooksbrothers.com', price: 8999 },
        { name: 'Zara', url: 'https://zara.com', price: 6990 }
      ]
    },
    // Accessories
    {
      name: 'Leather Handbag',
      description: 'Genuine leather handbag with multiple compartments. Elegant design for work or play.',
      price: 3499,
      originalPrice: 4999,
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'],
      category: 'accessories',
      gender: 'female',
      sizes: ['Free'],
      colors: [{ name: 'Brown', hex: '#8B4513' }, { name: 'Black', hex: '#000000' }, { name: 'Tan', hex: '#D2B48C' }],
      brand: 'Luxe Leather',
      stock: 32,
      rating: 4.7,
      numReviews: 234,
      featured: true,
      trending: true,
      tags: ['leather', 'handbag', 'work'],
      competitors: [
        { name: 'Coach', url: 'https://coach.com', price: 8999 },
        { name: 'Michael Kors', url: 'https://michaelkors.com', price: 7999 }
      ]
    },
    {
      name: 'Designer Sunglasses',
      description: 'UV-protected designer sunglasses with polarized lenses. Style meets functionality.',
      price: 1999,
      originalPrice: 2999,
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
      category: 'accessories',
      gender: 'unisex',
      sizes: ['Free'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Gold', hex: '#FFD700' }, { name: 'Silver', hex: '#C0C0C0' }],
      brand: 'Shade Luxe',
      stock: 58,
      rating: 4.5,
      numReviews: 178,
      featured: false,
      trending: true,
      tags: ['sunglasses', 'summer', 'protection'],
      competitors: [
        { name: 'Ray-Ban', url: 'https://ray-ban.com', price: 2999 },
        { name: 'Oakley', url: 'https://oakley.com', price: 3499 }
      ]
    },
    {
      name: 'Silk Scarf',
      description: '100% pure silk scarf with beautiful print. Versatile accessory for any outfit.',
      price: 1299,
      originalPrice: 1999,
      images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'],
      category: 'accessories',
      gender: 'female',
      sizes: ['Free'],
      colors: [{ name: 'Floral', hex: '#FF69B4' }, { name: 'Geometric', hex: '#4B0082' }],
      brand: 'Silk Dreams',
      stock: 45,
      rating: 4.6,
      numReviews: 112,
      featured: false,
      trending: false,
      tags: ['silk', 'elegant', 'accessory'],
      competitors: [
        { name: 'Hermes', url: 'https://hermes.com', price: 8999 },
        { name: 'Gucci', url: 'https://gucci.com', price: 5999 }
      ]
    },
    // Shoes
    {
      name: 'Comfort Heels',
      description: 'Stylish block heels with cushioned footbed. Comfort meets elegance for all-day wear.',
      price: 2799,
      originalPrice: 3999,
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'],
      category: 'shoes',
      gender: 'female',
      sizes: ['36', '37', '38', '39', '40'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Nude', hex: '#E3BC9A' }, { name: 'Red', hex: '#FF0000' }],
      brand: 'Step In Style',
      stock: 38,
      rating: 4.4,
      numReviews: 189,
      featured: true,
      trending: true,
      tags: ['heels', 'comfortable', 'office'],
      competitors: [
        { name: 'Steve Madden', url: 'https://stevemadden.com', price: 3999 },
        { name: 'Nine West', url: 'https://ninewest.com', price: 3499 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'
    },
    {
      name: 'White Sneakers',
      description: 'Clean white sneakers with premium leather. Perfect for casual and smart-casual looks.',
      price: 3299,
      originalPrice: 4499,
      images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'],
      category: 'shoes',
      gender: 'unisex',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }],
      brand: 'Street Style',
      stock: 62,
      rating: 4.8,
      numReviews: 456,
      featured: true,
      trending: true,
      tags: ['sneakers', 'casual', 'trendy'],
      competitors: [
        { name: 'Nike', url: 'https://nike.com', price: 4999 },
        { name: 'Adidas', url: 'https://adidas.com', price: 4499 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    },
    {
      name: 'Oxford Formal Shoes',
      description: 'Classic oxford shoes for the professional man. Premium leather with Goodyear welt construction.',
      price: 3999,
      originalPrice: 5499,
      images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500'],
      category: 'shoes',
      gender: 'male',
      sizes: ['39', '40', '41', '42', '43', '44'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Brown', hex: '#8B4513' }],
      brand: 'Executive',
      stock: 25,
      rating: 4.7,
      numReviews: 145,
      featured: false,
      trending: false,
      tags: ['formal', 'leather', 'classic'],
      competitors: [
        { name: 'Clarks', url: 'https://clarks.com', price: 4999 },
        { name: 'Allen Edmonds', url: 'https://allenedmonds.com', price: 7999 }
      ]
    },
    // Activewear
    {
      name: 'Sports Bra',
      description: 'High-support sports bra with moisture-wicking fabric. Perfect for intense workouts.',
      price: 999,
      originalPrice: 1499,
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'],
      category: 'activewear',
      gender: 'female',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Pink', hex: '#FF69B4' }, { name: 'Blue', hex: '#4169E1' }],
      brand: 'Fit Life',
      stock: 85,
      rating: 4.6,
      numReviews: 312,
      featured: false,
      trending: true,
      tags: ['sports', 'workout', 'support'],
      competitors: [
        { name: 'Nike', url: 'https://nike.com', price: 1499 },
        { name: 'Adidas', url: 'https://adidas.com', price: 1399 }
      ]
    },
    {
      name: 'Running Shorts',
      description: 'Lightweight running shorts with built-in liner. Quick-dry fabric for maximum comfort.',
      price: 1199,
      originalPrice: 1699,
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'],
      category: 'activewear',
      gender: 'male',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#808080' }],
      brand: 'Fit Life',
      stock: 68,
      rating: 4.5,
      numReviews: 198,
      featured: false,
      trending: true,
      tags: ['running', 'shorts', 'workout'],
      competitors: [
        { name: 'Nike', url: 'https://nike.com', price: 1699 },
        { name: 'Under Armour', url: 'https://underarmour.com', price: 1499 }
      ]
    },
    // Ethnic Wear
    {
      name: 'Anarkali Suit',
      description: 'Beautiful georgette anarkali suit with embroidery work. Perfect for festivals and celebrations.',
      price: 4999,
      originalPrice: 7999,
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'],
      category: 'ethnic',
      gender: 'female',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Maroon', hex: '#800000' }, { name: 'Blue', hex: '#000080' }, { name: 'Green', hex: '#008000' }],
      brand: 'Ethnic Heritage',
      stock: 28,
      rating: 4.9,
      numReviews: 267,
      featured: true,
      trending: true,
      tags: ['ethnic', 'anarkali', 'festival'],
      competitors: [
        { name: 'Libas', url: 'https://libas.in', price: 5999 },
        { name: 'W', url: 'https://won.com', price: 5499 }
      ],
      tryOnImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'
    },
    {
      name: 'Kurta Pajama Set',
      description: 'Traditional cotton kurta pajama set for men. Perfect for festivals and special occasions.',
      price: 3499,
      originalPrice: 4999,
      images: ['https://images.unsplash.com/photo-1595153579305-4d9b382f2d5b?w=500'],
      category: 'ethnic',
      gender: 'male',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Cream', hex: '#FFFDD0' }, { name: 'Blue', hex: '#000080' }],
      brand: 'Ethnic Heritage',
      stock: 35,
      rating: 4.7,
      numReviews: 156,
      featured: false,
      trending: true,
      tags: ['ethnic', 'kurta', 'traditional'],
      competitors: [
        { name: 'Manyavar', url: 'https://manyavar.com', price: 3999 },
        { name: 'Fabindia', url: 'https://fabindia.com', price: 4299 }
      ]
    }
  ];

  await Product.insertMany(products);
  console.log('Database seeded with products');
};

// Connect to MongoDB and start server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aura_style';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Aura Style API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
