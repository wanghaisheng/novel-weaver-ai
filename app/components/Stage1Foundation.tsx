

import React, { useState }from 'react';
import { Stage1Data, CharacterProfile } from '../types';
import { TextInput } from './common/TextInput';
import { TextAreaInput } from './common/TextAreaInput';
import CharacterInput from './CharacterInput';
import { META_PROMPT_SECTIONS } from '../constants';
import { LoadingSpinner } from './common/LoadingSpinner';
import { autoFillStage1DataWithAI } from '../services/geminiService';


interface Stage1FoundationProps {
  data: Stage1Data;
  onChange: (updatedData: Stage1Data) => void;
}

const Stage1Foundation: React.FC<Stage1FoundationProps> = ({ data, onChange }) => {
  const sections = META_PROMPT_SECTIONS.stage1;
  const [autoFillInput, setAutoFillInput] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);


  const handleChange = (field: keyof Stage1Data, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleWorldBuildingChange = (field: keyof Stage1Data['worldBuilding'], value: string) => {
    onChange({
      ...data,
      worldBuilding: { ...data.worldBuilding, [field]: value },
    });
  };

  const handleCharacterChange = (index: number, updatedChar: CharacterProfile) => {
    const newCharacters = [...data.characters];
    newCharacters[index] = updatedChar;
    handleChange('characters', newCharacters);
  };

  const addCharacter = () => {
    const newChar: CharacterProfile = {
      id: Date.now().toString(), 
      name: '',
      role: '',
    };
    handleChange('characters', [...data.characters, newChar]);
  };

  const removeCharacter = (index: number) => {
    handleChange(
      'characters',
      data.characters.filter((_, i) => i !== index)
    );
  };

  const handleAutoFill = async () => {
    if (!autoFillInput.trim()) return;
    setIsAutoFilling(true);
    setAutoFillError(null);
    try {
      const suggestions = await autoFillStage1DataWithAI(autoFillInput, data);
      
      let updatedData = { ...data };

      for (const key of ['coreIdea', 'genre', 'tone', 'targetAudience', 'theme', 'logline'] as const) {
        if (suggestions[key]) {
          updatedData[key] = suggestions[key] as string;
        }
      }

      if (suggestions.worldBuilding) {
        updatedData.worldBuilding = { ...updatedData.worldBuilding, ...suggestions.worldBuilding };
      }
      
      let updatedCharacters = [...updatedData.characters];
      if (suggestions.characters && suggestions.characters.length > 0) {
        suggestions.characters.forEach(suggestedChar => {
          const existingCharIndex = updatedCharacters.findIndex(c => c.role === suggestedChar.role && c.role !== ''); 
          if (existingCharIndex !== -1 && suggestedChar.role !== 'supporting') { 
            updatedCharacters[existingCharIndex] = { 
                ...updatedCharacters[existingCharIndex], 
                ...suggestedChar,
                id: updatedCharacters[existingCharIndex].id 
            };
          } else { 
             const newId = suggestedChar.id || `${Date.now()}_sugg_${updatedCharacters.length}`;
             if (!updatedCharacters.find(c => c.id === newId)) {
                updatedCharacters.push({ ...suggestedChar, id: newId });
             }
          }
        });
      }
      updatedData.characters = updatedCharacters;

      onChange(updatedData);
      setAutoFillInput('');
    } catch (error) {
      console.error("Error auto-filling Stage 1:", error);
      setAutoFillError(error instanceof Error ? error.message : "An unknown error occurred during auto-fill.");
    } finally {
      setIsAutoFilling(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Auto-fill section */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-3 tracking-tight">Quick Start with AI</h3>
        <TextAreaInput
          label="Describe your novel's core concept, a character, or a scene snippet here. AI will attempt to fill in the fields below based on your input."
          id="autoFillStage1Input"
          value={autoFillInput}
          onChange={(e) => setAutoFillInput(e.target.value)}
          rows={3}
          instruction="Example: A lone astronaut on Mars discovers an ancient alien artifact that broadcasts a distress signal."
        />
        <button
          onClick={handleAutoFill}
          disabled={isAutoFilling || !autoFillInput.trim()}
          className="mt-3 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {isAutoFilling ? 'AI is Generating...' : 'Auto-fill Fields with AI'}
        </button>
        {isAutoFilling && <LoadingSpinner />}
        {autoFillError && <p className="mt-3 text-sm text-destructive-foreground bg-destructive/80 border border-destructive p-3 rounded-md">{autoFillError}</p>}
      </div>


      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-1 tracking-tight">Core Idea & Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">{sections.coreIdea.split(':')[0]}</p>
        <TextAreaInput label="Core Idea" id="coreIdea" value={data.coreIdea} instruction={sections.coreIdea} onChange={(e) => handleChange('coreIdea', e.target.value)} rows={2} />
        
        <p className="text-sm text-muted-foreground mt-6 mb-2">{sections.coreSettings}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <TextInput label="Genre" id="genre" value={data.genre} instruction={sections.genre} onChange={(e) => handleChange('genre', e.target.value)} />
            <TextInput label="Tone" id="tone" value={data.tone} instruction={sections.tone} onChange={(e) => handleChange('tone', e.target.value)} />
            <TextInput label="Target Audience" id="targetAudience" value={data.targetAudience} instruction={sections.targetAudience} onChange={(e) => handleChange('targetAudience', e.target.value)} />
            <TextInput label="Theme / Core Message" id="theme" value={data.theme} instruction={sections.theme} onChange={(e) => handleChange('theme', e.target.value)} />
        </div>
        <TextAreaInput label="Logline" id="logline" value={data.logline} instruction={sections.logline} onChange={(e) => handleChange('logline', e.target.value)} rows={3}/>
      </div>

      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-1 tracking-tight">Character Profiles</h3>
        <p className="text-sm text-muted-foreground mb-4">{sections.characterProfiles}</p>
        {data.characters.map((char, index) => (
          <CharacterInput
            key={char.id}
            character={char}
            index={index}
            onChange={(updatedChar) => handleCharacterChange(index, updatedChar)}
            onRemove={() => removeCharacter(index)}
          />
        ))}
        <button
          onClick={addCharacter}
          className="mt-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
        >
          Add Character
        </button>
      </div>

      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-primary mb-1 tracking-tight">World-Building</h3>
        <p className="text-sm text-muted-foreground mb-4">{sections.worldBuilding}</p>
        <TextInput label="Era & Location" id="timeAndPlace" value={data.worldBuilding.timeAndPlace} instruction={sections.timeAndPlace} onChange={(e) => handleWorldBuildingChange('timeAndPlace', e.target.value)} />
        <TextAreaInput label="Core Rules/Laws" id="coreRules" value={data.worldBuilding.coreRules} instruction={sections.coreRules} onChange={(e) => handleWorldBuildingChange('coreRules', e.target.value)} />
        <TextAreaInput label="Social Structure & Culture" id="socialStructure" value={data.worldBuilding.socialStructure} instruction={sections.socialStructure} onChange={(e) => handleWorldBuildingChange('socialStructure', e.target.value)} />
        <TextAreaInput label="Key Locations" id="keyLocations" value={data.worldBuilding.keyLocations} instruction={sections.keyLocations} onChange={(e) => handleWorldBuildingChange('keyLocations', e.target.value)} />
      </div>
    </div>
  );
};

export default Stage1Foundation;