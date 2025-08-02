import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PlywoodFormationLoader from './components/PlywoodFormationLoader';
import { AdaptiveAnimationProvider } from './components/AdaptiveAnimationProvider';
import Navigation from './components/Navigation';
import PrecisionWoodCutterScrollbar from './components/PrecisionWoodCutterScrollbar';
import BackgroundAnimations from './components/BackgroundAnimations';
import EnhancedCustomCursor from './components/EnhancedCustomCursor';
import { deviceCapabilityDetector } from './utils/DeviceCapabilityDetector';
import { smoothScrollSystem } from './utils/SmoothScrollSystem';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Services from './pages/Services';
import NotFound from './pages/NotFound';
import './styles/globals.css';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReady, setIsReady] = React.useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setIsReady(true);
    }, 300);
  };

  // Initialize systems
  React.useEffect(() => {
    // Initialize device capability detection and smooth scrolling
    const settings = deviceCapabilityDetector.getSettings();
    console.log('Device capability settings:', settings);
    
    // Subscribe to device capability changes
    const unsubscribe = deviceCapabilityDetector.subscribe((newSettings) => {
      console.log('Device settings updated:', newSettings);
    });
    
    // Add error handling
    const handleError = (error: ErrorEvent) => {
      console.warn('Application error:', error);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      unsubscribe();
      smoothScrollSystem.destroy();
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  const settings = deviceCapabilityDetector.getSettings();

  return (
    <Router>
      <AdaptiveAnimationProvider>
        <div className="App">
          {isLoading && <PlywoodFormationLoader onComplete={handleLoadingComplete} />}
          
          {isReady && (
            <>
              {settings.features.customCursor && <EnhancedCustomCursor />}
              <PrecisionWoodCutterScrollbar />
              {settings.features.backgroundEffects && <BackgroundAnimations />}
              <Navigation />
              
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </>
          )}
        </div>
      </AdaptiveAnimationProvider>
    </Router>
  );
}

export default App;