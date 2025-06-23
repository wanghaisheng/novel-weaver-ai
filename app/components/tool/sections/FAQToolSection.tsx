

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
}

const faqsContent: FAQItem[] = [ // Renamed to avoid conflict with component name
  {
    question: "How much control do I really have over the AI's suggestions?",
    answer: "You have full control. The AI provides drafts, suggestions, and ideas. You can edit them, ignore them, rewrite them, or use them as a starting point for your own creativity. Novel Weaver AI is a tool to assist, not replace, your unique voice."
  },
  {
    question: "What's the best way to prompt the AI for chapter writing (Stage 3)?",
    answer: "Be as specific as possible. Include the key plot points from your outline that need to occur in the chapter, define the POV character, state the chapter's core goal (e.g., reveal a clue, increase tension, introduce a character), and describe the desired tone or atmosphere. The more detailed your prompt, the more relevant the AI's contribution will be."
  },
  {
    question: "Can the AI remember details from previous chapters or stages?",
    answer: "Yes, the AI is designed to use the context from your Foundation (Stage 1), Plot Outline (Stage 2), and chapter-specific prompts to maintain consistency. For longer works, you might occasionally need to remind it of specific earlier details in your prompts if they are crucial for the current section."
  },
  {
    question: "What if I don't like what the AI writes?",
    answer: "That's perfectly normal in a creative process! You can: 1. Edit the AI's output directly. 2. Delete it and try a slightly different prompt for the same section. 3. Use parts of it that you like and rewrite the rest. 4. Treat it as a 'what not to do' and explore an alternative direction. The AI's output is meant to be a flexible starting point."
  },
  {
    question: "Is my work saved automatically?",
    answer: "Novel Weaver AI uses your browser's local storage to save your work automatically as you type. This is convenient for quickly resuming your session. However, local storage can sometimes be cleared by browser settings or actions. We STRONGLY recommend you frequently use the 'Download Novel (.txt)' button to save a permanent copy of your work to your computer."
  },
  {
    question: "Are there any limits on genre or style the AI can handle?",
    answer: "The AI is highly versatile and can adapt to a wide range of genres and styles. The key is the clarity and specificity of your inputs in Stage 1 (genre, tone) and your detailed prompts throughout the process. The more you guide the AI, the better it can match your desired narrative style."
  },
  {
    question: "How does the 'Quick Start with AI' in Stage 1 actually work?",
    answer: "When you provide a core concept in the 'Quick Start' text area, the AI analyzes your input and attempts to creatively populate the various fields in Stage 1, such as Core Idea, Genre, Tone, potential Characters, and World-Building elements, to give you a comprehensive head start."
  },
  {
    question: "Can I collaborate with other writers using this tool?",
    answer: "Currently, Novel Weaver AI is designed as a solo writing tool. The work is saved in your browser's local storage. However, you can easily share your progress by downloading the .txt file and sending it to collaborators."
  }
];

const FAQToolSection: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-card rounded-xl shadow-xl border border-border">
      <div className="px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center tracking-tight">
          {t('faqs.tool.sectionTitle')}
        </h2>
        <p className="text-lg text-foreground mb-12 text-center leading-relaxed">
          {t('faqs.tool.sectionDescription')}
        </p>
        <div className="space-y-4">
          {faqsContent.map((faq, index) => ( // Use faqsContent here
            <div key={index} className="bg-secondary rounded-lg shadow-md border border-border">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full p-5 text-left hover:bg-accent/70 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary"
                aria-expanded={openIndex === index}
                aria-controls={`faq-tool-answer-${index}`}
              >
                <span className="text-lg font-medium text-primary">{faq.question}</span>
                <span className={`transform transition-transform duration-200 text-muted-foreground ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </button>
              {openIndex === index && (
                <div id={`faq-tool-answer-${index}`} className="p-5 border-t border-border">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQToolSection;