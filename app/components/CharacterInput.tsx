

import React from 'react';
import { CharacterProfile } from '../types';
import { TextInput } from './common/TextInput';
import { TextAreaInput } from './common/TextAreaInput';
import { META_PROMPT_SECTIONS } from '../constants';

interface CharacterInputProps {
  character: CharacterProfile;
  onChange: (updatedCharacter: CharacterProfile) => void;
  onRemove: () => void;
  index: number;
}

const CharacterInput: React.FC<CharacterInputProps> = ({ character, onChange, onRemove, index }) => {
  const handleChange = (field: keyof CharacterProfile, value: string) => {
    onChange({ ...character, [field]: value });
  };
  const charFields = META_PROMPT_SECTIONS.stage1.characterFields;

  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-primary">
          Character {index + 1}: {character.name || 'New Character'}
          {character.role && <span className="text-sm text-muted-foreground ml-2">({character.role})</span>}
        </h4>
        <button
          onClick={onRemove}
          className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-150 ease-in-out"
        >
          Remove
        </button>
      </div>

      <select
        value={character.role}
        onChange={(e) => handleChange('role', e.target.value)}
        className="w-full p-3 mb-4 border border-input rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200 shadow-sm"
        aria-label={`Character ${index + 1} role`}
      >
        <option value="">Select Role</option>
        <option value="protagonist">Protagonist</option>
        <option value="antagonist">Antagonist</option>
        <option value="supporting">Supporting Character</option>
      </select>

      <TextInput label="Name" id={`char_name_${character.id}`} value={character.name} instruction={charFields.name} onChange={(e) => handleChange('name', e.target.value)} />
      <TextInput label="Identity/Profession" id={`char_identity_${character.id}`} value={character.identity || ''} instruction={charFields.identity} onChange={(e) => handleChange('identity', e.target.value)} />
      <TextAreaInput label="Appearance" id={`char_appearance_${character.id}`} value={character.appearance || ''} instruction={charFields.appearance} onChange={(e) => handleChange('appearance', e.target.value)} />
      <TextAreaInput label="Personality" id={`char_personality_${character.id}`} value={character.personality || ''} instruction={charFields.personality} onChange={(e) => handleChange('personality', e.target.value)} />
      <TextAreaInput label="Core Desire/Goal (Want)" id={`char_want_${character.id}`} value={character.want || ''} instruction={charFields.want} onChange={(e) => handleChange('want', e.target.value)} />
      <TextAreaInput label="Inner Need (Need)" id={`char_need_${character.id}`} value={character.need || ''} instruction={charFields.need} onChange={(e) => handleChange('need', e.target.value)} />
      <TextAreaInput label="Weakness/Fatal Flaw" id={`char_flaw_${character.id}`} value={character.flaw || ''} instruction={charFields.flaw} onChange={(e) => handleChange('flaw', e.target.value)} />
      <TextAreaInput label="Background Story Snippet" id={`char_backstory_${character.id}`} value={character.backstory || ''} instruction={charFields.backstory} onChange={(e) => handleChange('backstory', e.target.value)} />
      <TextAreaInput label="Character Arc" id={`char_arc_${character.id}`} value={character.arc || ''} instruction={charFields.arc} onChange={(e) => handleChange('arc', e.target.value)} />

      {character.role === 'antagonist' && (
        <>
          <TextAreaInput label="Antagonist Motivation" id={`char_ant_motivation_${character.id}`} value={character.motivation || ''} instruction={charFields.antagonistMotivation} onChange={(e) => handleChange('motivation', e.target.value)} />
          <TextAreaInput label="Relationship to Protagonist" id={`char_ant_relationship_${character.id}`} value={character.relationshipToProtagonist || ''} instruction={charFields.antagonistRelationship} onChange={(e) => handleChange('relationshipToProtagonist', e.target.value)} />
        </>
      )}

      {character.role === 'supporting' && (
        <>
          <TextInput label="Function in Story" id={`char_sup_function_${character.id}`} value={character.functionInStory || ''} instruction={charFields.supportingFunction} onChange={(e) => handleChange('functionInStory', e.target.value)} />
          <TextAreaInput label="Brief Description (Supporting)" id={`char_sup_brief_${character.id}`} value={character.briefDescription || ''} instruction={charFields.supportingBrief} onChange={(e) => handleChange('briefDescription', e.target.value)} />
        </>
      )}
    </div>
  );
};

export default CharacterInput;