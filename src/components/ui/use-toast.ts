
// Simple re-export to avoid circular dependencies
export { toast } from "sonner";

// Compatibility function for existing code
export const useToast = () => {
  return {
    toast: (props: any) => {
      if (typeof props === 'string') {
        return import('sonner').then(({ toast }) => toast(props));
      }
      if (props.title && props.description) {
        return import('sonner').then(({ toast }) => toast(props.title, { description: props.description }));
      }
      return import('sonner').then(({ toast }) => toast(props.title || 'Notification'));
    },
    dismiss: () => import('sonner').then(({ toast }) => toast.dismiss())
  };
};
