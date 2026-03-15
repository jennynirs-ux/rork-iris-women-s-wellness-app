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
    if (Platform.OS === 'web') {
      // Web: use browser APIs
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOffline(!navigator.onLine);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    } else if (NetInfo?.addEventListener) {
      // Native: use @react-native-community/netinfo
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsOffline(state.isConnected === false);
      });
      return () => unsubscribe();
    }
  }, []);

  return { isOffline };
}
