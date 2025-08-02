import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';

const About: React.FC = () => {
  const timeline = [
    { year: '1998', title: 'Company Founded', description: 'Started as a small family business with a passion for quality wood products.' },
    { year: '2005', title: 'First Major Contract', description: 'Secured our first large-scale commercial project, establishing our reputation.' },
    { year: '2012', title: 'Facility Expansion', description: 'Expanded our manufacturing facility to meet growing demand.' },
    { year: '2018', title: 'Eco-Certification', description: 'Achieved environmental certification for sustainable practices.' },
    { year: '2023', title: 'Premium Line Launch', description: 'Launched WoodCraft Premium, our flagship product line.' }
  ];

  const team = [
    { name: 'David Chen', role: 'CEO & Founder', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Sarah Williams', role: 'Head of Operations', image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Michael Rodriguez', role: 'Quality Control Manager', image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Emily Johnson', role: 'Design Director', image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400' }
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
              About WoodCraft
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              For over 25 years, we've been crafting premium plywood solutions that combine traditional craftsmanship with modern innovation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <h2 className="text-4xl font-bold mb-8 glow-text">Our Mission</h2>
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  At WoodCraft Premium, we believe that quality wood products are the foundation of exceptional construction and design. Our mission is to provide the finest plywood solutions that exceed expectations and stand the test of time.
                </p>
                <p>
                  We combine decades of expertise with cutting-edge technology to deliver products that are not only beautiful but also sustainable and environmentally responsible.
                </p>
                <p>
                  Every sheet of plywood that leaves our facility represents our commitment to excellence, innovation, and the satisfaction of our valued customers.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5974062/pexels-photo-5974062.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Woodworking craftsmanship" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-2xl"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">Our Journey</h2>
          </ScrollReveal>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-indigo-600"></div>
            
            {timeline.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.2}>
                <div className={`flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="timeline-card interactive p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                      <div className="text-2xl font-bold text-purple-400 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full border-4 border-black"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">Meet Our Team</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="team-card interactive group">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-400">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-16 glow-text">Our Values</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', description: 'We never compromise on the quality of our materials or craftsmanship.' },
              { title: 'Sustainability', description: 'Environmental responsibility is at the core of everything we do.' },
              { title: 'Innovation', description: 'We continuously invest in new technologies and processes.' }
            ].map((value, index) => (
              <ScrollReveal key={index} delay={index * 0.2}>
                <div className="value-card interactive p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-center">
                  <h3 className="text-2xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;