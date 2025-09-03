// Exportações centralizadas dos utilitários
export * from './validation';
export * from './format';
export * from './storage';

// Re-exportações para facilitar importação
export {
  isValidEmail,
  isValidPassword,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidURL,
  isValidDate,
  isValidNumber,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  hasExactLength,
  hasMinValue,
  hasMaxValue,
  isBetween,
  isNotEmptyArray,
  isNotEmptyObject
} from './validation';

export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  formatFileSize,
  formatDuration,
  capitalize,
  capitalizeWords,
  removeAccents,
  formatSlug,
  truncateText,
  maskText,
  maskEmail
} from './format';

export {
  LocalStorage,
  SessionStorage,
  localStorage,
  sessionStorage,
  tokenStorage,
  userStorage,
  preferencesStorage,
  STORAGE_KEYS
} from './storage';
