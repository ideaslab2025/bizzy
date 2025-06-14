
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHapticFeedback } from "@/utils/hapticFeedback";

interface AuthErrorStateProps {
  onRetry?: () => void;
}

export const AuthErrorState = ({ onRetry }: AuthErrorStateProps) => {
  const { trigger } = useHapticFeedback();

  const handleRetry = () => {
    trigger('light');
    onRetry?.();
  };

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-red-400" />
      <span className="text-red-400 text-sm">Auth error</span>
      {onRetry && (
        <Button
          onClick={handleRetry}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
