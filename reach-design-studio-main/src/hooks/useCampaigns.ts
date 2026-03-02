import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await apiClient.getCampaigns();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch campaigns');
      }
      return response.data || [];
    },
  });
}

export function useSaveCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: any) => {
      const response = await apiClient.saveCampaign(campaign);
      if (!response.success) {
        throw new Error(response.error || 'Failed to save campaign');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save campaign');
    },
  });
}

export function useLaunchCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      options
    }: {
      campaignId: string;
      options: { source?: string; leadIds?: string[] }
    }) => {
      const response = await apiClient.launchCampaign(campaignId, options);
      if (!response.success) {
        throw new Error(response.error || 'Failed to launch campaign');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Campaign launched successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to launch campaign');
    },
  });
}

export function useStartCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await apiClient.startCampaign(campaignId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to start campaign');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign started successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start campaign');
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await apiClient.pauseCampaign(campaignId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to pause campaign');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign paused successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to pause campaign');
    },
  });
}

export function useResumeCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await apiClient.resumeCampaign(campaignId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to resume campaign');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign resumed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resume campaign');
    },
  });
}
