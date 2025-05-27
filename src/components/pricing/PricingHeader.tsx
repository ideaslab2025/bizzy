
import React from 'react';

interface PricingHeaderProps {
  title: string;
  description: string;
}

export const PricingHeader = ({ title, description }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">{description}</p>
    </div>
  );
};
