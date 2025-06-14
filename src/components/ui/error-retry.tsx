
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHapticFeedback } from "@/utils/hapticFeedback";

interface ErrorRetryProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorRetry = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}: ErrorRetryProps) => {
  const { trigger } = useHapticFeedback();

  const handleRetry = () => {
    trigger('light');
    onRetry?.();
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Oops!</h3>
        <p className="text-red-600 mb-4 max-w-md">{message}</p>
        {showRetry && onRetry && (
          <Button 
            onClick={handleRetry}
            variant="outline" 
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
