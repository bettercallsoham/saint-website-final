import { useMutation } from '@tanstack/react-query';
import { contactApi, ContactFormData } from '../services';
import { toast } from 'sonner';

// Contact Hooks

// Submit contact form
export const useContactSubmit = () => {
  return useMutation({
    mutationFn: (formData: ContactFormData) => contactApi.submit(formData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};