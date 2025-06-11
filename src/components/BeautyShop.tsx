import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
import type { BeautyStandard } from '../lib/beautyStandards';
import type { BeautyProduct } from '../lib/beautyProducts';
import { getBeautyProductsByStandard } from '../lib/beautyProducts';
import { getBeautyStandards } from '../lib/beautyStandards';
import { useCartStore } from '../lib/store';
import toast from 'react-hot-toast';

interface BeautyShopProps {
  initialStandard?: string;
}

export function BeautyShop({ initialStandard }: BeautyShopProps) {
  const [standards, setStandards] = useState<BeautyStandard[]>([]);
  const [productsByStandard, setProductsByStandard] = useState<Record<string, BeautyProduct[]>>({});
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function loadData() {
      try {
        const [standardsData, productsData] = await Promise.all([
          getBeautyStandards(),
          getBeautyProductsByStandard()
        ]);
        setStandards(standardsData);
        setProductsByStandard(productsData);
        
        if (initialStandard) {
          const standard = standardsData.find(s => 
            s.name.toLowerCase().includes(initialStandard.toLowerCase())
          );
          if (standard) {
            setSelectedStandard(standard.id);
          }
        } else if (standardsData.length > 0) {
          setSelectedStandard(standardsData[0].id);
        }
      } catch (error) {
        console.error('Error loading shop data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialStandard]);

  const handleAddToCart = (product: BeautyProduct) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  const selectedProducts = selectedStandard ? productsByStandard[selectedStandard] : [];
  const currentStandard = standards.find(s => s.id === selectedStandard);

  return (
    <div className="container mx-auto">
      {/* Beauty Standards Navigation */}
      <div className="flex overflow-x-auto gap-4 pb-6 mb-8 scrollbar-hide">
        {standards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => setSelectedStandard(standard.id)}
            className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              selectedStandard === standard.id
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                : 'bg-white/80 hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90'
            }`}
          >
            {standard.culture} - {standard.name}
          </button>
        ))}
      </div>

      {/* Selected Standard Description */}
      {currentStandard && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">{currentStandard.culture} Beauty</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {currentStandard.description}
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                  <span className="text-sm text-pink-500 dark:text-pink-400">
                    {product.category}
                  </span>
                </div>
                <span className="text-xl font-bold">${product.price}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}