import { AdminUser, AdminPermission } from '@/types/admin';
import { ADMIN_CREDENTIALS, ROLE_PERMISSIONS } from '@/constants/adminData';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_ADMIN = 'iris_admin_session';

export const [AdminContext, useAdmin] = createContextHook(() => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['adminSession'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_ADMIN);
      return stored ? JSON.parse(stored) as AdminUser : null;
    },
  });

  useEffect(() => {
    if (sessionQuery.data !== undefined) {
      setAdminUser(sessionQuery.data);
    }
  }, [sessionQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const cred = ADMIN_CREDENTIALS[username.toLowerCase()];
      if (!cred || cred.password !== password) {
        throw new Error('Invalid credentials');
      }
      const user: AdminUser = {
        username: username.toLowerCase(),
        role: cred.role,
        permissions: ROLE_PERMISSIONS[cred.role] as AdminPermission[],
      };
      await AsyncStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(user));
      return user;
    },
    onSuccess: (user) => {
      setAdminUser(user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY_ADMIN);
    },
    onSuccess: () => {
      setAdminUser(null);
      queryClient.invalidateQueries({ queryKey: ['adminSession'] });
    },
  });

  const hasPermission = useCallback((permission: AdminPermission): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission);
  }, [adminUser]);

  return {
    adminUser,
    isAuthenticated: !!adminUser,
    isLoading: sessionQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error?.message ?? null,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    hasPermission,
  };
});
