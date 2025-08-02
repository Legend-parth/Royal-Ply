import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'marine', label: 'Marine' }
  ];

  const galleryItems = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Modern Kitchen Cabinets',
      category: 'residential',
      description: 'Premium plywood kitchen cabinets with contemporary design'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Office Interior',
      category: 'commercial',
      description: 'Commercial office space with custom plywood paneling'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Custom Dining Table',
      category: 'furniture',
      description: 'Handcrafted dining table using premium plywood'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Yacht Interior',
      category: 'marine',
      description: 'Marine-grade plywood interior for luxury yacht'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Living Room Feature Wall',
      category: 'residential',
      description: 'Decorative plywood feature wall in modern living room'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Restaurant Interior',
      category: 'commercial',
      description: 'Warm plywood interior design for upscale restaurant'
    },
    {
      id: 7,
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Custom Bookshelf',
      category: 'furniture',
      description: 'Built-in bookshelf system using premium plywood'
    },
    {
      id: 8,
      image: 'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Boat Deck',
      category: 'marine',
      description: 'Marine plywood decking for recreational boat'
    },
    {
      id: 9,
      image: 'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Bedroom Wardrobe',
      category: 'residential',
      description: 'Custom wardrobe design with plywood construction'
    }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

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
              Project Gallery
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Explore our portfolio of stunning projects showcasing the versatility and beauty of premium plywood.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`filter-btn interactive px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    filter === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6">
          <motion.div 
            className="masonry-grid"
            layout
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="masonry-item"
              >
                <ScrollReveal delay={index * 0.05}>
                  <div 
                    className="gallery-card interactive group cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
            <motion.img
              src={selectedImage}
              alt="Gallery image"
              className="relative z-10 max-w-full max-h-full object-contain rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
            <button
              className="absolute top-4 right-4 z-20 text-white text-4xl hover:text-purple-400 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Project Statistics
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Projects Completed' },
              { number: '50+', label: 'Commercial Clients' },
              { number: '25+', label: 'Years Experience' },
              { number: '99%', label: 'Client Satisfaction' }
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Let us help you bring your vision to life with our premium plywood solutions.
            </p>
            <button className="cta-button interactive px-12 py-4 text-lg font-semibold bg-white text-purple-900 rounded-full hover:scale-105 transition-all duration-300">
              Get a Quote
            </button>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default Gallery;