
import { toast } from "sonner";

// Simple re-export to avoid circular dependencies
export { toast };

// Compatibility function for existing code
export const useToast = () => {
  return {
    toast: (props: any) => {
      if (typeof props === 'string') {
        return toast(props);
      }
      if (props?.title && props?.description) {
        return toast(props.title, { description: props.description });
      }
      return toast(props?.title || 'Notification');
    },
    dismiss: () => toast.dismiss()
  };
};
