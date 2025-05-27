import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Is TimeTravelers only for students and early career professionals?",
      answer: "While our primary focus is on those early in their career journey, professionals at any stage can benefit from TimeTravelers, especially when considering career transitions or advancement."
    },
    {
      question: "How accurate is the AI guidance compared to human mentors?",
      answer: "Our AI Travelers are trained on extensive data from successful professionals across various career stages. While no AI can perfectly replicate human experience, our system offers consistent, unbiased guidance based on comprehensive career data."
    },
    {
      question: "Can I change my AI Traveler Team if my career goals change?",
      answer: "Absolutely! The Team Evolution function allows your AI Traveler team to adapt as your career develops, introducing new specialized AI personas when needed."
    },
    {
      question: "How is my data used and protected?",
      answer: "We prioritize your privacy and security. Your data is used solely to personalize your experience and improve our AI systems. All information is encrypted and never shared with third parties."
    },
    {
      question: "Is there a limit to how many missions I can complete?",
      answer: "Free tier users have access to a limited number of missions per month, while Premium users enjoy unlimited missions and advanced tracking."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-purple-900/30">
                <AccordionTrigger className="text-left text-lg font-medium text-purple-300 hover:text-purple-200 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
