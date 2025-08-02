import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const Products: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Products' },
    { id: 'interior', label: 'Interior' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'marine', label: 'Marine Grade' },
    { id: 'commercial', label: 'Commercial' }
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Interior Plywood',
      category: 'interior',
      price: '$45',
      image: 'https://images.pexels.com/photos/5974062/pexels-photo-5974062.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'High-quality interior plywood perfect for furniture and cabinetry.',
      features: ['Smooth finish', 'Void-free core', 'Easy to work with']
    },
    {
      id: 2,
      name: 'Weather-Resistant Exterior',
      category: 'exterior',
      price: '$52',
      image: 'https://images.pexels.com/photos/5974064/pexels-photo-5974064.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Durable exterior plywood designed to withstand harsh weather conditions.',
      features: ['Weather resistant', 'Structural grade', 'Long-lasting']
    },
    {
      id: 3,
      name: 'Marine Grade Plywood',
      category: 'marine',
      price: '$68',
      image: 'https://images.pexels.com/photos/5974066/pexels-photo-5974066.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Premium marine-grade plywood for boat building and marine applications.',
      features: ['Waterproof', 'Marine certified', 'Premium quality']
    },
    {
      id: 4,
      name: 'Commercial Grade Plywood',
      category: 'commercial',
      price: '$38',
      image: 'https://images.pexels.com/photos/5974068/pexels-photo-5974068.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Cost-effective commercial grade plywood for construction projects.',
      features: ['Cost-effective', 'Structural strength', 'Versatile use']
    },
    {
      id: 5,
      name: 'Decorative Veneer Plywood',
      category: 'interior',
      price: '$75',
      image: 'https://images.pexels.com/photos/5974070/pexels-photo-5974070.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Beautiful decorative plywood with premium wood veneer finish.',
      features: ['Premium veneer', 'Beautiful grain', 'Ready to finish']
    },
    {
      id: 6,
      name: 'Fire-Retardant Plywood',
      category: 'commercial',
      price: '$85',
      image: 'https://images.pexels.com/photos/5974072/pexels-photo-5974072.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Fire-retardant plywood meeting commercial safety standards.',
      features: ['Fire retardant', 'Safety certified', 'Commercial grade']
    }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 glow-text">
              Our Products
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Discover our comprehensive range of premium plywood products, each crafted to meet the highest standards of quality and performance.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`filter-btn interactive px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ScrollReveal delay={index * 0.1}>
                  <div className="product-card interactive group bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105">
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className="price-tag bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full font-semibold">
                          {product.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{product.name}</h3>
                      <p className="text-gray-300 mb-4">{product.description}</p>
                      
                      <div className="space-y-2 mb-6">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-400">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Technical Specifications
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Thickness Range', value: '3mm - 25mm', icon: '📏' },
              { title: 'Standard Sizes', value: '4x8, 5x10 feet', icon: '📐' },
              { title: 'Moisture Content', value: '< 12%', icon: '💧' },
              { title: 'Grade Standards', value: 'IS:303, BWP', icon: '✅' }
            ].map((spec, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="spec-card interactive p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-center">
                  <div className="text-3xl mb-4">{spec.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{spec.title}</h3>
                  <p className="text-purple-400 font-medium">{spec.value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="container mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-4xl font-bold mb-8 text-white">
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Our experts can help you find the perfect plywood solution for your specific project requirements.
            </p>
            <button className="cta-button interactive px-12 py-4 text-lg font-semibold bg-white text-purple-900 rounded-full hover:scale-105 transition-all duration-300">
              Contact Our Experts
            </button>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default Products;