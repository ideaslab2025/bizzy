
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHapticFeedback } from "@/utils/hapticFeedback";

interface NetworkErrorProps {
  onRetry?: () => void;
  isOffline?: boolean;
}

export const NetworkError = ({ onRetry, isOffline = false }: NetworkErrorProps) => {
  const { trigger } = useHapticFeedback();

  const handleRetry = () => {
    trigger('medium');
    onRetry?.();
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        {isOffline ? (
          <WifiOff className="w-12 h-12 text-orange-500 mb-4" />
        ) : (
          <Wifi className="w-12 h-12 text-orange-500 mb-4" />
        )}
        <h3 className="text-lg font-semibold text-orange-700 mb-2">
          {isOffline ? "You're Offline" : "Connection Issues"}
        </h3>
        <p className="text-orange-600 mb-4 max-w-md">
          {isOffline 
            ? "Check your internet connection and try again."
            : "We're having trouble connecting to our servers."
          }
        </p>
        {onRetry && (
          <Button 
            onClick={handleRetry}
            variant="outline" 
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
