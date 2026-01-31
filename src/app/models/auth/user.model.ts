export type UserTheme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  theme?: UserTheme;
  createdAt?: string;
  updatedAt?: string;
}
