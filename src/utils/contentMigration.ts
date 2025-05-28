
import type { RichContentBlock } from '@/types/guidance';

// Transform plain text content to rich content blocks
export const transformToRichContent = (content: string, stepType?: string): RichContentBlock[] => {
  const blocks: RichContentBlock[] = [];
  
  // Add main content as text block
  if (content) {
    blocks.push({
      type: 'text',
      content: content
    });
  }
  
  // Add step-specific enhancements based on common patterns
  if (stepType === 'action') {
    // Add a checklist for action steps
    blocks.push({
      type: 'checklist',
      items: [
        {
          id: 'understand-requirements',
          label: 'Understand the requirements',
          helpText: 'Review what needs to be done in this step',
          completed: false
        },
        {
          id: 'gather-documents',
          label: 'Gather necessary documents',
          helpText: 'Collect any required paperwork or information',
          completed: false
        },
        {
          id: 'complete-action',
          label: 'Complete the action',
          helpText: 'Follow the instructions to finish this step',
          completed: false
        }
      ]
    });
  }
  
  // Add tips for complex steps
  if (stepType === 'complex') {
    blocks.push({
      type: 'tip',
      content: 'Take your time with this step. It may require multiple attempts or additional research.'
    });
  }
  
  return blocks;
};

// Sample rich content templates for different business formation steps
export const sampleRichContent = {
  bankAccount: [
    {
      type: 'text',
      content: '# Opening Your Business Bank Account\n\nOne of your first priorities is separating business and personal finances.'
    },
    {
      type: 'alert',
      variant: 'warning',
      title: 'Legal Requirement',
      content: 'Limited companies must have a separate business bank account. Mixing funds can lead to loss of limited liability protection.'
    },
    {
      type: 'checklist',
      items: [
        { id: 'gather-docs', label: 'Gather required documents', helpText: 'Certificate of Incorporation, Articles of Association, ID for all directors', completed: false },
        { id: 'compare-banks', label: 'Compare business bank accounts', helpText: 'Consider fees, features, and integration with accounting software', completed: false },
        { id: 'apply-online', label: 'Apply online or book appointment', helpText: 'Most banks offer online applications taking 15-30 minutes', completed: false },
        { id: 'await-approval', label: 'Await approval and account setup', helpText: 'Usually 1-5 business days', completed: false }
      ]
    },
    {
      type: 'tip',
      content: 'Many banks offer 18-24 months free banking for startups. Compare offers from Starling, Tide, and traditional banks.'
    },
    {
      type: 'action_button',
      label: 'Compare Business Bank Accounts',
      action: { type: 'external_link', url: '/resources/bank-comparison' }
    }
  ],
  
  hmrcRegistration: [
    {
      type: 'text',
      content: '# Register with HMRC for Corporation Tax\n\nYour company must register for Corporation Tax within 3 months of starting business activity.'
    },
    {
      type: 'alert',
      variant: 'destructive',
      title: 'Important Deadline',
      content: 'You have 3 months from your first day of business activity to register. Late registration can result in penalties.'
    },
    {
      type: 'checklist',
      items: [
        { id: 'determine-start-date', label: 'Determine your business start date', helpText: 'This is usually your incorporation date or when you first traded', completed: false },
        { id: 'gather-company-info', label: 'Gather company information', helpText: 'Company registration number, registered address, director details', completed: false },
        { id: 'register-online', label: 'Register online with HMRC', helpText: 'Use the CT41G form online - takes about 15 minutes', completed: false },
        { id: 'receive-utr', label: 'Receive your Unique Taxpayer Reference (UTR)', helpText: 'HMRC will send this by post within 2 weeks', completed: false }
      ]
    },
    {
      type: 'action_button',
      label: 'Register with HMRC Online',
      action: { type: 'external_link', url: 'https://www.gov.uk/register-for-corporation-tax' }
    }
  ]
};
