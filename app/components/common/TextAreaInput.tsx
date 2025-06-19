

import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  rows?: number;
  instruction?: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, id, rows = 4, instruction, ...props }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      {instruction && <p className="text-xs text-muted-foreground mb-1.5 italic">{instruction}</p>}
      <textarea
        id={id}
        rows={rows}
        {...props}
        className={`w-full p-3 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200 shadow-sm ${props.className || ''}`}
      />
    </div>
  );
};