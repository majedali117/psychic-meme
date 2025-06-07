import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';

// Import existing App components
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import TargetFields from './components/TargetFields';
import Advantages from './components/Advantages';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

// This component will render the main marketing site pages
const MainSite = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Hero />
      <About />
      <HowItWorks />
      <TargetFields />
      <Advantages />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* 
        This is the key: All paths starting with /admin/ are now handled by the AdminRoutes component.
        The "*" is a wildcard that allows AdminRoutes to manage its own sub-routes.
      */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* All other paths fall back to the main marketing site */}
      <Route path="*" element={<MainSite />} />
    </Routes>
  );
}

export default App;