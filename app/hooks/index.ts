// Exportações centralizadas dos hooks
export { useAuth } from './useAuth';
export { useUsers } from './useUsers';
export { useApi, useFileUpload } from './useApi';
export { useSenators, useSenatorDetail, useSenatorVotes } from './useSenators';
export { useProjects, useProjectDetail } from './useProjects';
export { useProjectVotes } from './useVoting';

// Re-exportações para facilitar importação
export type { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  UserRole,
  AuthState 
} from '~/types/auth';
export type { SearchParams } from '~/types/common';
