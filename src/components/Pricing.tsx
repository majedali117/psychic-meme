import { Button } from "./ui/button";

export default function Pricing() {
  const tiers = [
    {
      name: "Free Tier",
      price: "Free",
      features: [
        "Basic profile creation and TELL coordinate generation",
        "Access to 2 basic AI Travelers",
        "Limited missions and protocols",
        "One Consciousness Transfer Session per week",
        "Access to public knowledge repository"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Premium Tier",
      price: "$9.99/month",
      features: [
        "Comprehensive profile and advanced matching",
        "Full AI Traveler Team of 3-5 specialized personas",
        "Unlimited missions and advanced tracking",
        "Daily Consciousness Transfer Sessions",
        "Complete Protocol Guidance System",
        "Private knowledge repository with AI organization"
      ],
      cta: "Upgrade to Premium",
      highlighted: true
    },
    {
      name: "Enterprise Solutions",
      price: "Custom Pricing",
      features: [
        "Custom deployment for educational institutions",
        "Corporate programs for employee development",
        "Specialized AI teams for organizational needs",
        "Analytics and reporting for program effectiveness",
        "White-label options for institutional branding"
      ],
      cta: "Contact Us",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Pricing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border ${
                tier.highlighted 
                  ? "bg-gradient-to-b from-purple-900/50 to-blue-900/50 border-purple-500/50 shadow-lg shadow-purple-500/10" 
                  : "bg-gray-800/50 border-gray-700/50"
              } flex flex-col h-full`}
            >
              <h3 className="text-2xl font-semibold mb-2 text-center">
                {tier.name}
              </h3>
              <div className="text-center mb-6">
                <span className={`text-3xl font-bold ${tier.highlighted ? "text-purple-300" : "text-gray-300"}`}>
                  {tier.price}
                </span>
              </div>
              <ul className="mb-8 flex-grow space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full py-6 ${
                  tier.highlighted 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
