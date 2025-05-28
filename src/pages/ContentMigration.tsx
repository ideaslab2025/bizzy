
import React from 'react';
import { ContentMigrator } from '@/components/guidance/ContentMigrator';

const ContentMigration = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Migration</h1>
          <p className="text-gray-600 mt-2">
            Transform existing content to rich content blocks
          </p>
        </div>
        
        <ContentMigrator />
      </div>
    </div>
  );
};

export default ContentMigration;
