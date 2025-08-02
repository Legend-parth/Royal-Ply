import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Our Showroom',
      details: ['123 Woodcraft Avenue', 'Industrial District', 'City, State 12345']
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri: 8AM-6PM']
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['info@woodcraftpremium.com', 'sales@woodcraftpremium.com', 'support@woodcraftpremium.com']
    }
  ];

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
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Get in touch with our experts to discuss your plywood needs and discover how we can help bring your project to life.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <ScrollReveal direction="left">
              <div className="contact-form-container">
                <h2 className="text-3xl font-bold mb-8 glow-text">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input interactive w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input interactive w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input interactive w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="form-input interactive w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="quote">Request a Quote</option>
                        <option value="product">Product Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="form-input interactive w-full px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-vertical"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="submit-btn interactive w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Information */}
            <ScrollReveal direction="right">
              <div className="contact-info-container">
                <h2 className="text-3xl font-bold mb-8 glow-text">Get in Touch</h2>
                
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-card interactive p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-3">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-300">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-white mb-4">Find Us</h3>
                  <div className="map-container interactive rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🗺️</div>
                        <p className="text-gray-300">Interactive Map</p>
                        <p className="text-sm text-gray-400">Map integration coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Frequently Asked Questions
            </h2>
          </ScrollReveal>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: 'What types of plywood do you offer?',
                answer: 'We offer a comprehensive range including interior, exterior, marine-grade, commercial, and decorative plywood in various thicknesses and sizes.'
              },
              {
                question: 'Do you provide custom cutting services?',
                answer: 'Yes, we offer precision cutting services to meet your specific project requirements. Contact us with your specifications for a quote.'
              },
              {
                question: 'What is your delivery timeframe?',
                answer: 'Standard orders are typically delivered within 3-5 business days. Custom orders may take 7-10 business days depending on specifications.'
              },
              {
                question: 'Do you offer bulk pricing?',
                answer: 'Yes, we provide competitive bulk pricing for large orders. Contact our sales team for volume discounts and special rates.'
              }
            ].map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="faq-item interactive p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Our team is standing by to help you with your plywood needs. Get in touch today for expert advice and competitive pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cta-button interactive px-8 py-4 text-lg font-semibold bg-white text-purple-900 rounded-full hover:scale-105 transition-all duration-300">
                Call Now
              </button>
              <button className="cta-button interactive px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300">
                Request Quote
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;