

import React, { useState } from 'react';
import { NovelData, Stage3Data, Chapter } from '../types';
import { TextInput } from './common/TextInput';
import { TextAreaInput } from './common/TextAreaInput';
import { LoadingSpinner } from './common/LoadingSpinner';
import { generateChapterContent } from '../services/geminiService';
import { META_PROMPT_SECTIONS } from '../constants';

interface Stage3WritingProps {
  novelData: NovelData;
  stage3Data: Stage3Data;
  onChange: (updatedData: Stage3Data) => void;
  onChapterUpdate: (chapterId: string, updatedContent: string) => void;
  onChapterGenerateStart: (chapterId: string) => void;
  onChapterGenerateEnd: (chapterId: string, content: string) => void;
}

const Stage3Writing: React.FC<Stage3WritingProps> = ({ 
    novelData, 
    stage3Data, 
    onChange, 
    onChapterUpdate,
    onChapterGenerateStart,
    onChapterGenerateEnd
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const sections = META_PROMPT_SECTIONS.stage3;

  const handlePromptChange = (field: keyof Stage3Data['currentChapterPrompt'], value: string | number) => {
    onChange({
      ...stage3Data,
      currentChapterPrompt: {
        ...stage3Data.currentChapterPrompt,
        [field]: value,
      },
    });
  };

  const handleAddChapter = async () => {
    setIsLoading(true);
    const newChapterNumber = stage3Data.chapters.length + 1;
    const newChapterId = Date.now().toString();

    const tempChapter: Chapter = {
      id: newChapterId,
      number: newChapterNumber,
      title: `Chapter ${newChapterNumber}`, 
      ...stage3Data.currentChapterPrompt,
      content: "Generating chapter content...",
      isWriting: true,
    };
    
    const updatedChapters = [...stage3Data.chapters, tempChapter];
    onChange({ ...stage3Data, chapters: updatedChapters });
    onChapterGenerateStart(newChapterId);


    try {
      const generatedContent = await generateChapterContent(
        novelData,
        newChapterNumber,
        stage3Data.currentChapterPrompt
      );
      onChapterGenerateEnd(newChapterId, generatedContent);
    } catch (error) {
      console.error("Failed to generate chapter:", error);
      onChapterGenerateEnd(newChapterId, "Error generating chapter. Please try again.");
    } finally {
      setIsLoading(false);
       onChange({
        ...stage3Data,
        chapters: stage3Data.chapters.map(c => c.id === newChapterId ? {...c, isWriting: false} : c), 
        currentChapterPrompt: { 
            povCharacter: '', coreGoal: '', keyPlotPoints: '', 
            startingScene: '', endingScene: '', atmosphere: '', wordCount: undefined 
        }
      });
    }
  };
  
  const handleChapterContentChange = (chapterId: string, newContent: string) => {
    onChapterUpdate(chapterId, newContent);
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <p className="text-md text-foreground leading-relaxed">{sections.intro}</p>
      </div>
      
      <div className="p-6 bg-card rounded-xl shadow-xl border border-border">
        <h3 className="text-xl font-semibold text-primary mb-4 tracking-tight">
          Draft New Chapter (Next: Chapter {stage3Data.chapters.length + 1})
        </h3>
        <TextInput label="POV Character" id="povCharacter" instruction={sections.pov} value={stage3Data.currentChapterPrompt.povCharacter} onChange={(e) => handlePromptChange('povCharacter', e.target.value)} />
        <TextAreaInput label="Core Goal of this Chapter" id="coreGoal" instruction={sections.coreGoal} value={stage3Data.currentChapterPrompt.coreGoal} onChange={(e) => handlePromptChange('coreGoal', e.target.value)} />
        <TextAreaInput label="Key Plot Points (from outline)" id="keyPlotPoints" instruction={sections.keyPlotPoints} value={stage3Data.currentChapterPrompt.keyPlotPoints} onChange={(e) => handlePromptChange('keyPlotPoints', e.target.value)} />
        <TextAreaInput label="Starting Scene" id="startingScene" instruction={sections.startingScene} value={stage3Data.currentChapterPrompt.startingScene} onChange={(e) => handlePromptChange('startingScene', e.target.value)} />
        <TextAreaInput label="Ending Scene (hook)" id="endingScene" instruction={sections.endingScene} value={stage3Data.currentChapterPrompt.endingScene} onChange={(e) => handlePromptChange('endingScene', e.target.value)} />
        <TextInput label="Atmosphere/Emotion" id="atmosphere" instruction={sections.atmosphere} value={stage3Data.currentChapterPrompt.atmosphere} onChange={(e) => handlePromptChange('atmosphere', e.target.value)} />
        <TextInput label="Word Count (Optional)" id="wordCount" instruction={sections.wordCount} type="number" value={stage3Data.currentChapterPrompt.wordCount || ''} onChange={(e) => handlePromptChange('wordCount', parseInt(e.target.value) || undefined)} />
        
        <button
          onClick={handleAddChapter}
          disabled={isLoading}
          className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {isLoading ? 'Generating...' : `Generate Chapter ${stage3Data.chapters.length + 1}`}
        </button>
        {isLoading && <LoadingSpinner />}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-primary my-6 tracking-tight">Written Chapters</h3>
        {stage3Data.chapters.length === 0 && <p className="text-muted-foreground">No chapters written yet.</p>}
        {stage3Data.chapters.sort((a,b) => a.number - b.number).map((chapter) => (
          <div key={chapter.id} className="mb-8 p-6 bg-card rounded-xl shadow-xl border border-border">
            <TextInput 
              label={`Chapter ${chapter.number} Title`} 
              id={`chapter_title_${chapter.id}`} 
              value={chapter.title}
              onChange={(e) => {
                const updatedChapters = stage3Data.chapters.map(c => 
                  c.id === chapter.id ? { ...c, title: e.target.value } : c
                );
                onChange({ ...stage3Data, chapters: updatedChapters });
              }}
            />
            {chapter.isWriting ? (
                <LoadingSpinner />
            ) : (
                <TextAreaInput
                    label={`Content for Chapter ${chapter.number}: ${chapter.title}`}
                    id={`chapter_content_${chapter.id}`}
                    value={chapter.content}
                    onChange={(e) => handleChapterContentChange(chapter.id, e.target.value)}
                    rows={15}
                    className="text-sm leading-relaxed text-foreground" /* Assuming text-foreground for readability */
                />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stage3Writing;