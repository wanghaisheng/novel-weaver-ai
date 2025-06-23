

import React from 'react';

const showcases = [
  {
    title: "Stage 1: AI-Assisted Character Detail",
    userInputLabel: "User's Core Character Concept:",
    userInput: "A weary, cynical space marine captain who secretly collects antique maps of Earth.",
    aiOutputLabel: "AI Suggested Detail (Flaw & Need):",
    aiOutput: "Flaw: Trusts her ship's AI more than any human, leading to isolation and misjudgment in critical social situations.\nNeed: To find a reason to believe in humanity again, perhaps through an unexpected connection or act of selfless bravery.",
    borderColorClass: "border-primary" 
  },
  {
    title: "Stage 2: AI Elaborating on a Plot Point",
    userInputLabel: "User Input for Midpoint:",
    userInput: "The protagonist discovers the seemingly benevolent corporation is actually harvesting alien life force for profit.",
    aiOutputLabel: "AI-Generated Elaboration Snippet:",
    aiOutput: "The data logs flickered, each entry a nail in the coffin of her naivety. 'Project Chimera' wasn't about sustainable energy; it was about draining the very essence of the Xylosians. The shimmering, life-giving crystals they revered were being systematically shattered, their light siphoned into the corporation's insatiable war machine. The weight of this knowledge pressed down, heavier than any planet's gravity.",
    borderColorClass: "border-accent" 
  },
  {
    title: "Stage 3: AI Co-Drafting a Chapter Scene",
    userInputLabel: "Chapter Prompt Summary:",
    userInput: "Protagonist (Elias, a mage) confronts the shadow creature in the Whispering Woods. Atmosphere: Tense, Eerie.",
    aiOutputLabel: "AI-Generated Scene Snippet:",
    aiOutput: "The air in the Whispering Woods grew unnaturally cold. Elias clutched the Rowan staff, its faint warmth a stark contrast to the creeping dread. Twisted branches, like skeletal fingers, clawed at the moonless sky. Then, from the deepest shadows, it emerged – not a creature of flesh and blood, but a vortex of shifting darkness, its silence more terrifying than any roar. Two pinpricks of malevolent crimson light fixed on him, and the whispers began, insidious tendrils of doubt coiling around his mind.",
    borderColorClass: "border-primary" 
  },
  {
    title: "Stage 4: AI Enhancing a Description",
    userInputLabel: "Original User Text:",
    userInput: "The old castle was scary.",
    aiOutputLabel: "AI-Enhanced Description:",
    aiOutput: "Decrepit battlements clawed at the bruised twilight sky, the castle's silhouette a jagged wound against the dying light. An oppressive silence hung heavy, broken only by the mournful sigh of wind through shattered arrow slits. Each stone seemed to weep with a chilling dampness, promising forgotten horrors within its crumbling embrace.",
    borderColorClass: "border-accent"
  }
];

const ShowcaseToolSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-card rounded-xl shadow-xl border border-border">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">
          See the AI in Action: Sample Outputs
        </h2>
        <p className="text-lg text-foreground mb-12 text-center max-w-3xl mx-auto leading-relaxed">
          Novel Weaver AI is designed to be your creative collaborator. Here are a few examples of how the AI can assist in generating and refining content at various stages of your novel.
        </p>
        <div className="space-y-8">
          {showcases.map((showcase, index) => (
            <div key={index} className={`p-6 bg-secondary rounded-xl shadow-lg border-l-4 ${showcase.borderColorClass}`}>
              <h3 className="text-xl font-semibold text-foreground mb-4">{showcase.title}</h3>
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-1.5">{showcase.userInputLabel}</p>
                <div className="bg-background/70 p-3 rounded-md text-muted-foreground text-sm italic border border-border">
                  {showcase.userInput}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary mb-1.5">{showcase.aiOutputLabel}</p>
                <div className="bg-background/80 p-3 rounded-md text-foreground text-sm whitespace-pre-line border border-border">
                  {showcase.aiOutput}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseToolSection;