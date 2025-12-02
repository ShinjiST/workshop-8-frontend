export type UserRole = 'ADMINISTRATOR' | 'STANDARD';

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  language?: string;
}

// Дані для входу
export interface LoginCredentials {
  email: string;
  password: string;
}

// Відповідь сервера (припускаємо структуру, перевіримо пізніше)
export interface AuthResponse {
  accessToken: string; // або token - перевіримо в браузері
  user: User;
}


export interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirm: string; // <--- ДОДАЛИ ЦЕ
  username: string;
  name: string;
}