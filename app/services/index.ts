// Exportações centralizadas dos serviços
export { AuthService, authService } from './auth.service';
export { AuthServiceMock, authServiceMock } from './auth.service.mock';
export { UserService, userService } from './user.service';
export { SenatorService } from './senator.service';
export { ProjectService } from './project.service';
export { VotingService } from './voting.service';

// Re-exportações para facilitar importação
export type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  UserRole 
} from '~/types/auth';
