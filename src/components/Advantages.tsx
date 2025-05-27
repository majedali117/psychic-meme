export default function Advantages() {
  const advantages = [
    {
      title: "24/7 Availability",
      description: "Get guidance whenever you need it, without scheduling constraints"
    },
    {
      title: "Consistency",
      description: "Experience reliable quality of mentorship without variability"
    },
    {
      title: "Personalization",
      description: "Receive continuously adaptive guidance based on your evolving needs and learning style"
    },
    {
      title: "Comprehensive Expertise",
      description: "Access knowledge across multiple specializations and career stages simultaneously"
    },
    {
      title: "Objectivity",
      description: "Benefit from guidance based on comprehensive career data rather than limited personal experience"
    },
    {
      title: "Privacy",
      description: "Discuss career challenges and uncertainties in a judgment-free environment"
    }
  ];

  return (
    <section id="advantages" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Why Choose AI-Driven Mentorship?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-800/30 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-purple-700 rounded-full mb-4">
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">{advantage.title}</h3>
              <p className="text-gray-400">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
