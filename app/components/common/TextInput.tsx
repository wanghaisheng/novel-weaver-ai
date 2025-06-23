

import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  instruction?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, instruction, ...props }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      {instruction && <p className="text-xs text-muted-foreground mb-1.5 italic">{instruction}</p>}
      <input
        type="text"
        id={id}
        {...props}
        className={`w-full p-3 border border-input rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200 shadow-sm ${props.className || ''}`}
      />
    </div>
  );
};