export default function Footer() {
  return (
    <footer className="py-12 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-400">Agentive Buddy</h3>
            <p className="text-gray-400">
              Accelerate your career growth with AI mentors from your professional future.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-purple-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-purple-300 transition-colors">About</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-purple-300 transition-colors">How It Works</a></li>
              <li><a href="#target-fields" className="text-gray-400 hover:text-purple-300 transition-colors">Target Fields</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-purple-300 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-purple-300">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-gray-400 hover:text-purple-300 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-purple-300">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#contact" className="text-gray-400 hover:text-purple-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © 2025 Agentive Buddy. All rights reserved. The Agentive Buddy concept, features, and design are protected by intellectual property laws.
          </p>
        </div>
      </div>
    </footer>
  );
}
