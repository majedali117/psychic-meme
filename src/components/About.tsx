export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          The TimeTravelers Concept
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 text-gray-300">
            TimeTravelers is a revolutionary career guidance mobile application inspired by the Netflix series "Travelers." Our platform creates a unique ecosystem where advanced AI personas ("Travelers") embody the expertise and experience of professionals from various career stages to guide students and early career professionals ("Hosts") through the challenges of career development.
          </p>
          
          <p className="text-lg mb-6 text-gray-300">
            Just as in the Travelers series where consciousness from the future is sent back to help prevent catastrophes, our AI Travelers virtually "travel back" to mentor those starting their careers, helping them avoid common pitfalls and accelerate their professional development.
          </p>
          
          <div className="mt-12 p-6 bg-purple-900/30 rounded-xl border border-purple-800/50 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-purple-300">Our Mission</h3>
            <p className="text-gray-300">
              To democratize access to high-quality career guidance by leveraging AI to simulate the expertise and mentorship capabilities of seasoned professionals, making it available to everyone, anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
