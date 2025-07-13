import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex K.",
      role: "Software Developer",
      quote: "Agentive Buddy has completely transformed my career path. The AI Travelers identified skills I needed to develop that I never would have considered, and the mission structure kept me motivated and on track.",
      avatar: "AK"
    },
    {
      name: "Maya R.",
      role: "Registered Nurse",
      quote: "As a nursing student, I was overwhelmed by the different specialization options. My AI Traveler Team helped me explore each path and find the perfect fit for my interests and strengths.",
      avatar: "MR"
    },
    {
      name: "Jordan T.",
      role: "Business Analyst",
      quote: "The Protocol Guidance System has been invaluable for navigating office politics and difficult workplace situations. It's like having a team of experienced mentors in my pocket at all times.",
      avatar: "JT"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          What Our Users Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-purple-900/30 flex flex-col"
            >
              <div className="mb-4">
                <svg className="h-8 w-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 flex-grow">{testimonial.quote}</p>
              <div className="flex items-center mt-4">
                <Avatar className="h-10 w-10 mr-3 bg-purple-700">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-purple-300">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
