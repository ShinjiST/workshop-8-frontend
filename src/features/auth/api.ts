import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from '@tanstack/react-router';
import type { LoginCredentials, UserRole } from './types';
import type { RegisterCredentials } from './types';
import { z } from 'zod'; 

// 1. Описуємо, що саме лежить всередині зашифрованого токена
interface DecodedToken {
  id: number;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  exp?: number;
}

export const loginSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(1, "Введіть пароль"),
});

// Функція для розшифровки JWT
function parseJwt(token: string): DecodedToken | null {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;
    
    const base64Url = parts[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (e) {
    console.error("Помилка розшифровки токена", e);
    return null;
  }
}

// --- LOGIN ---
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data; 
    },
    onSuccess: (responseBody: any) => {
      console.log('Server raw response:', responseBody);

      let token = '';

      if (responseBody.data && typeof responseBody.data === 'string') {
        token = responseBody.data;
      }
      else if (typeof responseBody === 'string') {
        token = responseBody;
      }
      else if (responseBody.data?.token || responseBody.data?.accessToken) {
        token = responseBody.data.token || responseBody.data.accessToken;
      }
      else if (responseBody.token || responseBody.accessToken) {
        token = responseBody.token || responseBody.accessToken;
      }

      if (token) {
        token = token.replace('Bearer ', '').trim();
      }

      if (!token) {
        alert("Помилка: Не вдалося знайти токен.");
        return;
      }

      const decodedUser = parseJwt(token);

      const user = {
        id: decodedUser?.id || 0,
        email: decodedUser?.email || '',
        username: decodedUser?.username || '',
        name: decodedUser?.name || '',
        role: decodedUser?.role || 'STANDARD', 
      };

      // Зверни увагу: useLogin вже викликає login() зі стору!
      login(token, user as any);

      if (user.role === 'ADMINISTRATOR') {
        navigate({ to: '/parkingspaces/' as any }); 
      } else {
        navigate({ to: '/' as any });
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      alert('Невірний логін або пароль');
    }
  });
};

// --- REGISTER ---
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      alert("Акаунт успішно створено! Тепер увійдіть.");
      navigate({ to: '/login' as any });
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Помилка реєстрації. Можливо, такий email вже зайнятий.');
    }
  });
};