// Utilitários para gerenciamento de armazenamento local

// Chaves de armazenamento
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences'
} as const;

// Verificar se o localStorage está disponível
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Verificar se o sessionStorage está disponível
const isSessionStorageAvailable = (): boolean => {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Classe para gerenciamento de armazenamento local
export class LocalStorage {
  private static instance: LocalStorage;
  private available: boolean;

  private constructor() {
    this.available = isLocalStorageAvailable();
  }

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  // Verificar se está disponível
  public isAvailable(): boolean {
    return this.available;
  }

  // Obter item
  public getItem<T = any>(key: string): T | null {
    if (!this.available) return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  // Definir item
  public setItem<T = any>(key: string, value: T): boolean {
    if (!this.available) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  // Remover item
  public removeItem(key: string): boolean {
    if (!this.available) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  // Limpar todos os itens
  public clear(): boolean {
    if (!this.available) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  // Obter chaves
  public getKeys(): string[] {
    if (!this.available) return [];
    
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  // Verificar se existe
  public hasItem(key: string): boolean {
    if (!this.available) return false;
    
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  // Obter tamanho
  public getSize(): number {
    if (!this.available) return 0;
    
    try {
      return (localStorage as any).length;
    } catch {
      return 0;
    }
  }
}

// Classe para gerenciamento de armazenamento de sessão
export class SessionStorage {
  private static instance: SessionStorage;
  private available: boolean;

  private constructor() {
    this.available = isSessionStorageAvailable();
  }

  public static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage();
    }
    return SessionStorage.instance;
  }

  // Verificar se está disponível
  public isAvailable(): boolean {
    return this.available;
  }

  // Obter item
  public getItem<T = any>(key: string): T | null {
    if (!this.available) return null;
    
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  // Definir item
  public setItem<T = any>(key: string, value: T): boolean {
    if (!this.available) return false;
    
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  // Remover item
  public removeItem(key: string): boolean {
    if (!this.available) return false;
    
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  // Limpar todos os itens
  public clear(): boolean {
    if (!this.available) return false;
    
    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  // Obter chaves
  public getKeys(): string[] {
    if (!this.available) return [];
    
    try {
      return Object.keys(sessionStorage);
    } catch {
      return [];
    }
  }

  // Verificar se existe
  public hasItem(key: string): boolean {
    if (!this.available) return false;
    
    try {
      return sessionStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  // Obter tamanho
  public getSize(): number {
    if (!this.available) return 0;
    
    try {
      return (sessionStorage as any).length;
    } catch {
      return 0;
    }
  }
}

// Instâncias singleton
export const localStorage = LocalStorage.getInstance();
export const sessionStorage = SessionStorage.getInstance();

// Funções utilitárias para tokens
export const tokenStorage = {
  // Obter token de acesso
  getAccessToken: (): string | null => {
    return localStorage.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Definir token de acesso
  setAccessToken: (token: string): boolean => {
    return localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  // Remover token de acesso
  removeAccessToken: (): boolean => {
    return localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Obter token de refresh
  getRefreshToken: (): string | null => {
    return localStorage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Definir token de refresh
  setRefreshToken: (token: string): boolean => {
    return localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  // Remover token de refresh
  removeRefreshToken: (): boolean => {
    return localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Obter expiração do token
  getTokenExpiry: (): number | null => {
    return localStorage.getItem<number>(STORAGE_KEYS.TOKEN_EXPIRY);
  },

  // Definir expiração do token
  setTokenExpiry: (expiry: number): boolean => {
    return localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiry);
  },

  // Remover expiração do token
  removeTokenExpiry: (): boolean => {
    return localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  },

  // Limpar todos os tokens
  clearTokens: (): boolean => {
    const results = [
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
    ];
    return results.every(result => result);
  }
};

// Funções utilitárias para dados do usuário
export const userStorage = {
  // Obter dados do usuário
  getUserData: <T = any>(): T | null => {
    return localStorage.getItem<T>(STORAGE_KEYS.USER_DATA);
  },

  // Definir dados do usuário
  setUserData: <T = any>(userData: T): boolean => {
    return localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  // Remover dados do usuário
  removeUserData: (): boolean => {
    return localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// Funções utilitárias para preferências
export const preferencesStorage = {
  // Obter preferências
  getPreferences: <T = any>(): T | null => {
    return localStorage.getItem<T>(STORAGE_KEYS.PREFERENCES);
  },

  // Definir preferências
  setPreferences: <T = any>(preferences: T): boolean => {
    return localStorage.setItem(STORAGE_KEYS.PREFERENCES, preferences);
  },

  // Remover preferências
  removePreferences: (): boolean => {
    return localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  // Atualizar preferência específica
  updatePreference: <T = any>(key: string, value: T): boolean => {
    const current = preferencesStorage.getPreferences<Record<string, any>>() || {};
    const updated = { ...current, [key]: value };
    return preferencesStorage.setPreferences(updated);
  }
};
