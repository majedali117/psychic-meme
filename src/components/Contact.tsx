import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Get in Touch
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-300 mb-8">
            Have questions about Agentive Buddy? We'd love to hear from you!
          </p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                Subject
              </label>
              <Input 
                id="subject" 
                placeholder="How can we help you?" 
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <Textarea 
                id="message" 
                placeholder="Your message..." 
                rows={5}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6">
              Send Message
            </Button>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-gray-300">
              Email: <a href="mailto:info@agentivebuddy.com" className="text-purple-400 hover:text-purple-300">info@agentivebuddy.com</a>
            </p>
            <p className="text-gray-300 mt-2">
              Follow us: <a href="#" className="text-purple-400 hover:text-purple-300">@Agentive Buddy</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
