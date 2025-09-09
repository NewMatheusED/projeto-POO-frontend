import { useQuery } from '@tanstack/react-query';
import { ProjectService } from '~/services';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAllProjects,
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