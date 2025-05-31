
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Guidance = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Guidance</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Welcome to the guidance section. Here you'll find helpful resources and guidance for your business needs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Guidance;
