

import React from 'react';

const steps = [
  {
    id: 1,
    icon: '✨',
    title: 'Spark Your Idea (Stage 1: Foundation)',
    description: "Begin by defining your novel's core. Use the 'Quick Start with AI' for rapid ideation based on a concept, or meticulously fill in details for the Core Idea, Characters, and World. The more context you provide, the better the AI can assist in subsequent stages.",
  },
  {
    id: 2,
    icon: '🏗️',
    title: 'Architect Your Narrative (Stage 2: Outline)',
    description: "Follow the prompts of the classic three-act structure to outline your story's Beginning, Middle, and End. Flesh out key turning points, inciting incidents, midpoints, and the climax to create a robust structural backbone for your novel.",
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Collaborate on Chapters (Stage 3: Writing)',
    description: "For each chapter, provide specific goals, key plot points from your outline, desired atmosphere, and POV character. The AI will then help you draft the content, which you can edit, refine, or use as a springboard for your own writing.",
  },
  {
    id: 4,
    icon: '🎨',
    title: 'Elevate Your Draft (Stage 4: Revision)',
    description: "Select from various revision tasks like description enhancement, dialogue optimization, consistency checks, or pacing adjustments. Paste your text, and get AI-generated suggestions to polish your work to perfection.",
  },
  {
    id: 5,
    icon: '🏆',
    title: 'Claim Your Story (Download)',
    description: "At any point in the process, you can download your entire novel—including all foundational notes, outlines, and chapter drafts—as a simple .txt file. Your work is yours to keep and use as you wish.",
  },
];

const HowItWorksToolSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-card rounded-xl shadow-xl border border-border">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">
          Your Novel-Writing Journey: From Spark to Story
        </h2>
        <p className="text-lg text-foreground mb-12 text-center max-w-3xl mx-auto leading-relaxed">
          Novel Weaver AI offers a structured yet flexible process to guide you from the initial flicker of an idea to a completed manuscript. Here’s how you can leverage the tool:
        </p>
        <div className="space-y-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col md:flex-row items-start md:items-center bg-secondary p-6 rounded-xl shadow-lg border border-border hover:shadow-primary/10 transition-shadow duration-300">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <span className="text-5xl text-primary">{step.icon}</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Step {step.id}: {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksToolSection;