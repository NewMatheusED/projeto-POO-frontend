import { useQuery } from '@tanstack/react-query';
import { VotingService } from '~/services';

export const useProjectVotes = (processoCodigo: string) => {
  return useQuery({
    queryKey: ['project-votes', processoCodigo],
    queryFn: () => VotingService.getProjectVotes(processoCodigo),
    enabled: !!processoCodigo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};