const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentDetails } = req.body;
    const user = await User.findById(req.user.userId).populate('cart.product');

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let itemsPrice = 0;
    const orderItemsWithDetails = orderItems.map(item => {
      const product = user.cart.find(c => c.product._id.toString() === item.product);
      const price = product ? product.product.price : item.price;
      itemsPrice += price * item.quantity;
      return {
        product: item.product,
        name: item.name || product?.product?.name,
        image: item.image || product?.product?.images?.[0],
        price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      };
    });

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = new Order({
      user: req.user.userId,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
    });

    await order.save();

    user.orders.push(order._id);
    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort('-createdAt')
      .populate('orderItems.product');

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// Generate receipt
exports.generateReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const receipt = {
      orderId: order._id,
      date: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email
      },
      items: order.orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        size: item.size,
        color: item.color
      })),
      shipping: order.shippingAddress,
      pricing: {
        itemsTotal: order.itemsPrice,
        shipping: order.shippingPrice,
        tax: order.taxPrice,
        total: order.totalPrice
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.paymentDetails?.transactionId
      }
    };

    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ message: 'Error generating receipt', error: error.message });
  }
};
