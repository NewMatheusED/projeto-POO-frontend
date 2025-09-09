import { useQuery } from '@tanstack/react-query';
import { ProjectService } from '~/services';

export const useProjects = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => ProjectService.getAllProjects(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProjectDetail = (processoCodigo: string) => {
  return useQuery({
    queryKey: ['project', processoCodigo],
    queryFn: () => ProjectService.getProjectDetail(processoCodigo),
    enabled: !!processoCodigo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};