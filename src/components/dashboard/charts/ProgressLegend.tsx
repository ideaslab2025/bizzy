
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProgressLegend: React.FC = () => {
  const legendItems = [
    { 
      color: 'bg-green-600', 
      label: 'Completed (90-100%)', 
      description: 'Category substantially complete' 
    },
    { 
      color: 'bg-blue-600', 
      label: 'On Track (70-89%)', 
      description: 'Good progress, continue current pace' 
    },
    { 
      color: 'bg-yellow-600', 
      label: 'Attention Needed (40-69%)', 
      description: 'Review priorities and deadlines' 
    },
    { 
      color: 'bg-red-600', 
      label: 'Critical (0-39%)', 
      description: 'Immediate action required' 
    }
  ];

  const documentTypes = [
    { 
      icon: '📋', 
      label: 'Government Forms', 
      description: 'Official regulatory submissions' 
    },
    { 
      icon: '📄', 
      label: 'Document Templates', 
      description: 'Business operation documents' 
    },
    { 
      icon: '📑', 
      label: 'Policies', 
      description: 'Internal governance documents' 
    },
    { 
      icon: '📊', 
      label: 'Registers', 
      description: 'Statutory record keeping' 
    }
  ];

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Progress Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress Status Legend */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Completion Status</h4>
            <div className="space-y-3">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">{item.label}</span>
                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Types Legend */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Document Types</h4>
            <div className="space-y-3">
              {documentTypes.map((type, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0">{type.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">{type.label}</span>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Business Context */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="text-sm font-medium text-blue-900 mb-2">📈 Progress Tips</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Focus on completing required documents first for compliance</li>
            <li>• Critical documents have regulatory deadlines - prioritize these</li>
            <li>• Use document templates to speed up completion</li>
            <li>• Regular reviews help maintain steady progress</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressLegend;
