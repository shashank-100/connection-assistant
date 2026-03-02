import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function useLinkedInAccounts() {
  return useQuery({
    queryKey: ['linkedin-accounts'],
    queryFn: async () => {
      const response = await apiClient.getLinkedInAccounts();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch LinkedIn accounts');
      }
      return response.data || [];
    },
  });
}

export function useAddLinkedInAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ label, cookies }: { label: string; cookies: any[] }) => {
      const response = await apiClient.addLinkedInAccount(label, cookies);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add LinkedIn account');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-accounts'] });
      toast.success('LinkedIn account added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add LinkedIn account');
    },
  });
}

export function useDeleteLinkedInAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await apiClient.deleteLinkedInAccount(accountId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete LinkedIn account');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-accounts'] });
      toast.success('LinkedIn account deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete LinkedIn account');
    },
  });
}
