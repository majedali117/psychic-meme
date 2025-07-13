import { Card, CardContent } from "./ui/card";

export default function TargetFields() {
  const fields = [
    {
      name: "Technology",
      description: "Connect with AI personas embodying the expertise of seasoned tech professionals who can guide you through the rapidly evolving landscape of programming languages, frameworks, and industry practices.",
      icon: "💻"
    },
    {
      name: "Healthcare",
      description: "Receive AI-driven guidance for navigating the complex educational requirements, certification processes, and workplace dynamics unique to healthcare environments.",
      icon: "🏥"
    },
    {
      name: "Business & Management",
      description: "Understand corporate structures, develop leadership skills, and navigate the path from entry-level positions to management roles through AI personas trained on the experiences of successful business leaders.",
      icon: "📊"
    },
    {
      name: "Education & Training",
      description: "Get insights on certification requirements, teaching methodologies, and career advancement strategies in educational fields.",
      icon: "🎓"
    },
    {
      name: "Engineering",
      description: "Receive guidance on specialization choices, technical skill development, and industry-specific knowledge from AI personas embodying engineering expertise.",
      icon: "⚙️"
    }
  ];

  return (
    <section id="target-fields" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Target Fields
        </h2>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-gray-300">
          Agentive Buddy focuses on five high-demand professional fields, providing specialized AI guidance for each career path.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field, index) => (
            <Card key={index} className="bg-gray-800/50 border-purple-900/30 overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{field.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">{field.name}</h3>
                <p className="text-gray-400">{field.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
