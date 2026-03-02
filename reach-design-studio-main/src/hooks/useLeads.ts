import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await apiClient.getLeads();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch leads');
      }
      return response.data || [];
    },
  });
}

export function useLeadLists() {
  return useQuery({
    queryKey: ['lead-lists'],
    queryFn: async () => {
      const response = await apiClient.getLeadLists();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch lead lists');
      }
      return response.data || [];
    },
  });
}

export function useAddLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leads: any[]) => {
      const response = await apiClient.addLeads(leads);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add leads');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-lists'] });
      toast.success(data?.message || 'Leads added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add leads');
    },
  });
}

export function useDeleteLeadsBySource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (source: string) => {
      const response = await apiClient.deleteLeadsBySource(source);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete leads');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-lists'] });
      toast.success('Leads deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete leads');
    },
  });
}
