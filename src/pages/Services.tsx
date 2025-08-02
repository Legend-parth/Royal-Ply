import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

const Services: React.FC = () => {
  const services = [
    {
      icon: '🏗️',
      title: 'Custom Manufacturing',
      description: 'Tailored plywood solutions manufactured to your exact specifications and requirements.',
      features: ['Custom sizes', 'Special grades', 'Unique finishes', 'Volume production']
    },
    {
      icon: '✂️',
      title: 'Precision Cutting',
      description: 'Professional cutting services with state-of-the-art equipment for perfect dimensions.',
      features: ['CNC cutting', 'Edge finishing', 'Complex shapes', 'Tight tolerances']
    },
    {
      icon: '🚚',
      title: 'Delivery & Logistics',
      description: 'Reliable delivery services ensuring your materials arrive safely and on time.',
      features: ['Scheduled delivery', 'Nationwide shipping', 'Secure packaging', 'Tracking system']
    },
    {
      icon: '🔍',
      title: 'Quality Inspection',
      description: 'Comprehensive quality control ensuring every piece meets our high standards.',
      features: ['Visual inspection', 'Moisture testing', 'Strength testing', 'Grade certification']
    },
    {
      icon: '💡',
      title: 'Technical Consultation',
      description: 'Expert advice on material selection and application for your specific project needs.',
      features: ['Material selection', 'Application guidance', 'Cost optimization', 'Technical support']
    },
    {
      icon: '🔧',
      title: 'Installation Support',
      description: 'Professional installation guidance and support for optimal results.',
      features: ['Installation guides', 'On-site support', 'Training programs', 'Best practices']
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Consultation',
      description: 'We discuss your project requirements and provide expert recommendations.'
    },
    {
      step: '02',
      title: 'Quote',
      description: 'Receive a detailed quote with transparent pricing and delivery timeline.'
    },
    {
      step: '03',
      title: 'Production',
      description: 'Your order is manufactured with precision using premium materials.'
    },
    {
      step: '04',
      title: 'Quality Check',
      description: 'Rigorous quality inspection ensures every piece meets our standards.'
    },
    {
      step: '05',
      title: 'Delivery',
      description: 'Safe and timely delivery to your specified location.'
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
              Our Services
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Comprehensive plywood solutions and services designed to meet all your project needs with excellence and reliability.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              What We Offer
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="service-card interactive group p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Our Process
            </h2>
          </ScrollReveal>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <ScrollReveal key={index} delay={index * 0.2}>
                  <div className="process-step text-center relative">
                    <div className="relative z-10 mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Why Choose WoodCraft Premium
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '⚡', title: 'Fast Turnaround', description: 'Quick processing and delivery times' },
              { icon: '🎯', title: 'Precision Quality', description: 'Exact specifications every time' },
              { icon: '🏆', title: 'Expert Team', description: '25+ years of industry experience' },
              { icon: '💰', title: 'Competitive Pricing', description: 'Best value for premium quality' }
            ].map((benefit, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="benefit-card interactive text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">
              Industries We Serve
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Construction', icon: '🏢' },
              { name: 'Furniture', icon: '🪑' },
              { name: 'Marine', icon: '⛵' },
              { name: 'Interior Design', icon: '🏠' },
              { name: 'Architecture', icon: '🏛️' },
              { name: 'Manufacturing', icon: '🏭' }
            ].map((industry, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="industry-card interactive text-center p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl mb-3">{industry.icon}</div>
                  <h3 className="text-white font-medium">{industry.name}</h3>
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
              Ready to Experience Premium Service?
            </h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Let our experts help you find the perfect plywood solution for your project. Contact us today for personalized service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cta-button interactive px-8 py-4 text-lg font-semibold bg-white text-purple-900 rounded-full hover:scale-105 transition-all duration-300">
                Get a Quote
              </button>
              <button className="cta-button interactive px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300">
                Schedule Consultation
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;