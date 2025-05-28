
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { transformToRichContent, sampleRichContent } from '@/utils/contentMigration';

export const ContentMigrator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: number;
    errors: string[];
    total: number;
  } | null>(null);

  const migrateContent = async () => {
    setIsLoading(true);
    setProgress(0);
    setResults(null);

    try {
      // Get all steps that don't have rich_content
      const { data: steps, error: fetchError } = await supabase
        .from('guidance_steps')
        .select('id, title, content, step_type, difficulty_level')
        .is('rich_content', null);

      if (fetchError) throw fetchError;

      if (!steps || steps.length === 0) {
        setResults({ success: 0, errors: ['No steps found to migrate'], total: 0 });
        setIsLoading(false);
        return;
      }

      const total = steps.length;
      let success = 0;
      const errors: string[] = [];

      // Migrate each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setProgress((i / total) * 100);

        try {
          let richContent;

          // Use sample content for specific steps if available
          if (step.title.toLowerCase().includes('bank')) {
            richContent = sampleRichContent.bankAccount;
          } else if (step.title.toLowerCase().includes('hmrc') || step.title.toLowerCase().includes('tax')) {
            richContent = sampleRichContent.hmrcRegistration;
          } else {
            // Transform existing content
            richContent = transformToRichContent(
              step.content || '',
              step.step_type || undefined
            );
          }

          // Update the step with rich content
          const { error: updateError } = await supabase
            .from('guidance_steps')
            .update({ rich_content: richContent })
            .eq('id', step.id);

          if (updateError) {
            errors.push(`Failed to update step "${step.title}": ${updateError.message}`);
          } else {
            success++;
          }
        } catch (error) {
          errors.push(`Error processing step "${step.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setProgress(100);
      setResults({ success, errors, total });
    } catch (error) {
      setResults({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        total: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Content Migration Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool will migrate existing plain text content to rich content blocks.
            Only steps without existing rich content will be processed.
          </AlertDescription>
        </Alert>

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Migrating content...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>
                Migration completed: {results.success}/{results.total} steps updated
              </span>
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Errors encountered:</p>
                    <ul className="list-disc list-inside text-sm">
                      {results.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Button
          onClick={migrateContent}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Migrating...
            </>
          ) : (
            'Start Content Migration'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
