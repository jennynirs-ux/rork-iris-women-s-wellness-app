import { useEffect, useRef } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_PENDING_REFERRAL = "iris_pending_referral_code";

function extractReferralCode(url: string): string | null {
  try {
    const patterns = [
      /iris\.app\/invite\/([A-Z0-9-]+)/i,
      /rork-app:\/\/invite\/([A-Z0-9-]+)/i,
      /invite\/([A-Z0-9-]+)/i,
      /referral[=\/]([A-Z0-9-]+)/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log("[DeepLink] Extracted referral code:", match[1]);
        return match[1].toUpperCase();
      }
    }

    return null;
  } catch (err) {
    console.log("[DeepLink] Error extracting referral code:", err);
    return null;
  }
}

export async function getPendingReferralCode(): Promise<string | null> {
  try {
    const code = await AsyncStorage.getItem(STORAGE_KEY_PENDING_REFERRAL);
    return code;
  } catch {
    return null;
  }
}

export async function clearPendingReferralCode(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_PENDING_REFERRAL);
  } catch {
    console.log("[DeepLink] Failed to clear pending referral code");
  }
}

export function useDeepLinkReferral(onCodeReceived: (code: string) => void) {
  const handledUrls = useRef(new Set<string>());

  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (handledUrls.current.has(url)) return;
      handledUrls.current.add(url);

      const code = extractReferralCode(url);
      if (code) {
        console.log("[DeepLink] Referral code from URL:", code);
        await AsyncStorage.setItem(STORAGE_KEY_PENDING_REFERRAL, code);
        onCodeReceived(code);
      }
    };

    const handleLinkingUrl = (event: { url: string }) => {
      handleUrl(event.url);
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    }).catch((err) => {
      console.log("[DeepLink] Error getting initial URL:", err);
    });

    const subscription = Linking.addEventListener("url", handleLinkingUrl);

    return () => {
      subscription.remove();
    };
  }, [onCodeReceived]);
}
