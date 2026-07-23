import { Users, BadgeCheck, Layers, Workflow, MessageSquare, LifeBuoy } from 'lucide-react';
  
export default function WhyChooseUs() {
  const features: Array<{
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>; 
  }> = [
    {
      title: 'Expert Team',
      description: 'Experienced engineers and designers who deliver with precision and care.',
      Icon: Users,
    },
    {
      title: 'Proven Track Record',
      description: 'Successful launches across industries with measurable business outcomes.',
      Icon: BadgeCheck,
    },
    {
      title: 'Scalable Solutions',
      description: 'Systems designed for growth, performance, and long-term maintainability.',
      Icon: Layers,
    },
    {
      title: 'Automation-First Approach',
      description: 'We automate workflows to reduce manual effort and eliminate errors.',
      Icon: Workflow,
    },
    {
      title: 'Transparent Communication',
      description: 'Clear updates, fast feedback loops, and true partnership throughout.',
      Icon: MessageSquare,
    },
    {
      title: 'Continuous Support',
      description: 'Reliable post-launch support and iterative improvements when you need them.',
      Icon: LifeBuoy,
    },
  ];

  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-typography">Why Choose Us</h2>
          <p className="mt-2 text-md md:text-lg text-[#4A5565] mb-8 max-w-2xl mx-auto leading-relaxed">
            At Hashturn, we combine technical expertise with innovation to deliver reliable, scalable, and cost-effective digital solutions.
          </p>
        </div>

        <div
          className="px-14 mt-12 grid grid-cols-1 md:grid-cols-2 md:px-10 gap-8 md:gap-10"
        >
          {features.map(({ title, description, Icon }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="mt-1 text-sm md:text-base"
                    style={{ color: "#4A5565" }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 