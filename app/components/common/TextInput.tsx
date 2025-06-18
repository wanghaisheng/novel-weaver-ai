
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  instruction?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, instruction, ...props }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      {instruction && <p className="text-xs text-slate-400 mb-1.5 italic">{instruction}</p>}
      <input
        type="text"
        id={id}
        {...props}
        className={`w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 shadow-sm ${props.className || ''}`}
      />
    </div>
  );
};