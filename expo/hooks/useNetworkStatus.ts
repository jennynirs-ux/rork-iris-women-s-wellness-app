import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let NetInfo: any = null;
if (Platform.OS !== 'web') {
  try {
    NetInfo = require('@react-native-community/netinfo');
  } catch {
    // NetInfo not available — fall back to always-online
  }
}

export function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' && NetInfo?.addEventListener) {
      // Native: use @react-native-community/netinfo
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsOffline(state.isConnected === false);
      });
      return () => unsubscribe();
    }

    // Web: use browser APIs (guard every call — window.addEventListener
    // is undefined inside React Native even when Platform.OS is checked)
    if (
      typeof window !== 'undefined' &&
      typeof window.addEventListener === 'function'
    ) {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOffline(!navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return { isOffline };
}
