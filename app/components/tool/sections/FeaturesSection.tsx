

import React from 'react';

const features = [
  {
    icon: '💡',
    title: 'AI-Powered Ideation & World-Building',
    description: 'Auto-generates core ideas, characters, and world elements from simple prompts. Structured fields allow for detailed manual input, laying a rich foundation for your novel.',
    benefit: 'Blast through writer\'s block and establish a comprehensive story base in minutes, not days.',
  },
  {
    icon: '🗺️',
    title: 'Guided Plot Structuring',
    description: 'Utilizes the classic three-act structure with detailed prompts for each plot point, helping you build a narratively sound and compelling plot.',
    benefit: 'Ensure your story hits all the right beats and maintains a strong structural backbone from start to finish.',
  },
  {
    icon: '✍️',
    title: 'Intelligent Chapter Co-Writing',
    description: 'The AI assists in drafting chapter content based on your specific prompts, overall outline, and foundational elements.',
    benefit: 'Accelerate your first draft significantly, letting AI handle heavy lifting while you steer the creative direction.',
  },
  {
    icon: '🔎',
    title: 'Advanced Revision & Polishing',
    description: 'AI-driven tools for consistency checks, description enhancement, dialogue optimization, and pacing adjustments.',
    benefit: 'Refine your manuscript like a professional editor, improving clarity, engagement, and overall quality with actionable insights.',
  },
  {
    icon: '🔄',
    title: 'Seamless Integrated Workflow',
    description: 'All stages, from concept to revision, are integrated into one cohesive platform.',
    benefit: 'Navigate the entire novel-writing process smoothly, with a clear, step-by-step path to completion.',
  },
  {
    icon: '💾',
    title: 'Full Content Ownership & Export',
    description: 'Easily download your entire novel, including all stages and generated content, as a standard .txt file.',
    benefit: 'Your story is always yours. Export and use it anywhere, anytime, without restrictions.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-card rounded-xl shadow-xl border border-border">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">
          Unlock Your Storytelling Superpowers
        </h2>
        <p className="text-lg text-foreground mb-12 text-center max-w-3xl mx-auto leading-relaxed">
          Novel Weaver AI is packed with features designed to assist you at every stage of the novel writing process. Discover how our intelligent tools can transform your creative workflow.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-secondary p-6 rounded-xl shadow-lg border border-border hover:shadow-primary/10 hover:border-accent transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="text-4xl mb-4 text-center text-primary">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2 text-center">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 flex-grow leading-relaxed">{feature.description}</p>
              <p className="text-primary text-sm font-medium italic mt-auto pt-3 border-t border-border">Benefit: {feature.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;