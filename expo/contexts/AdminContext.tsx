import { AdminUser, AdminPermission } from '@/types/admin';
import { trpcClient } from '@/lib/trpc';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_ADMIN_TOKEN = 'iris_admin_token';

export const [AdminContext, useAdmin] = createContextHook(() => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['adminSession'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEY_ADMIN_TOKEN);
      if (!token) return null;

      // Verify token is still valid on the server
      try {
        const result = await trpcClient.admin.verify.query({ token });
        if (result.valid) {
          return {
            username: result.username,
            role: result.role,
            permissions: result.permissions as AdminPermission[],
          } as AdminUser;
        }
      } catch (error) {
        // Token verification failed
      }

      return null;
    },
  });

  useEffect(() => {
    if (sessionQuery.data !== undefined) {
      setAdminUser(sessionQuery.data);
    }
  }, [sessionQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      // Send credentials to server
      const result = await trpcClient.admin.login.mutate({ username, password });

      if (!result.success) {
        throw new Error('Login failed');
      }

      // Store token in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, result.token);

      const user: AdminUser = {
        username: username.toLowerCase(),
        role: result.role,
        permissions: [] as AdminPermission[], // Will be populated on verify
      };

      return user;
    },
    onSuccess: async (user) => {
      setAdminUser(user);
      // Trigger session query to verify and get full user data
      await queryClient.refetchQueries({ queryKey: ['adminSession'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY_ADMIN_TOKEN);
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
