import { useQuery } from '@tanstack/react-query';
import { SenatorService } from '~/services';
import type { Senator, SenatorDetail } from '~/types';

export const useSenators = () => {
  return useQuery({
    queryKey: ['senators'],
    queryFn: SenatorService.getAllSenators,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useSenatorDetail = (codigo: string) => {
  return useQuery({
    queryKey: ['senator', codigo],
    queryFn: () => SenatorService.getSenatorDetail(codigo),
    enabled: !!codigo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useSenatorVotes = (codigo: string) => {
  return useQuery({
    queryKey: ['senator-votes', codigo],
    queryFn: () => SenatorService.getSenatorVotes(codigo),
    enabled: !!codigo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
