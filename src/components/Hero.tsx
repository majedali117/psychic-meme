import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-500 opacity-10 animate-pulse"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Journey to Your Future Career with Agentive Buddy
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300">
          Harness the power of Agentive Buddies to accelerate your professional growth and avoid career pitfalls before they happen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105">
            Join the Waitlist
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20 px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105">
            Download App (Coming Soon)
          </Button>
        </div>
      </div>
    </section>
  );
}
