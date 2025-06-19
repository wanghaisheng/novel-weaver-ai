

import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-muted-foreground">Loading...</p>
    </div>
  );
};