import React from 'react';
import { X, ShoppingCart, Minus, Plus, CreditCard } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Here you would typically make a call to your backend to create a Stripe session
      // For demo purposes, we'll just show a success message
      alert('Checkout functionality will be implemented with your backend');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md p-6 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-bold">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p className="text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b dark:border-gray-700 py-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}