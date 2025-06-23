

import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};