import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { RefreshCw, Home, ShieldAlert } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "@/constants/translations";

const STORAGE_KEY_LANGUAGE = "iris_language";

const ERROR_STRINGS: Record<Language, { title: string; message: string; tryAgain: string; goHome: string }> = {
  en: { title: "Something went wrong", message: "An unexpected issue occurred. Don't worry — your data is safe.", tryAgain: "Try Again", goHome: "Go Home" },
  sv: { title: "Något gick fel", message: "Ett oväntat problem uppstod. Oroa dig inte — dina data är säkra.", tryAgain: "Försök igen", goHome: "Gå hem" },
  de: { title: "Etwas ist schiefgelaufen", message: "Ein unerwartetes Problem ist aufgetreten. Keine Sorge — deine Daten sind sicher.", tryAgain: "Erneut versuchen", goHome: "Startseite" },
  fr: { title: "Un problème est survenu", message: "Une erreur inattendue s'est produite. Ne vous inquiétez pas — vos données sont en sécurité.", tryAgain: "Réessayer", goHome: "Accueil" },
  es: { title: "Algo salió mal", message: "Ocurrió un problema inesperado. No te preocupes — tus datos están seguros.", tryAgain: "Intentar de nuevo", goHome: "Ir al inicio" },
  it: { title: "Qualcosa è andato storto", message: "Si è verificato un problema imprevisto. Non preoccuparti — i tuoi dati sono al sicuro.", tryAgain: "Riprova", goHome: "Vai alla home" },
  nl: { title: "Er ging iets mis", message: "Er is een onverwacht probleem opgetreden. Maak je geen zorgen — je gegevens zijn veilig.", tryAgain: "Opnieuw proberen", goHome: "Naar home" },
  pl: { title: "Coś poszło nie tak", message: "Wystąpił nieoczekiwany problem. Nie martw się — Twoje dane są bezpieczne.", tryAgain: "Spróbuj ponownie", goHome: "Strona główna" },
  pt: { title: "Algo deu errado", message: "Ocorreu um problema inesperado. Não se preocupe — seus dados estão seguros.", tryAgain: "Tentar novamente", goHome: "Ir para início" },
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  language: Language;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, language: "en" };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Error stack:", error.stack);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    void this.loadLanguage();
  }

  componentDidMount() {
    void this.loadLanguage();
  }

  loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_LANGUAGE);
      if (stored && stored in ERROR_STRINGS) {
        this.setState({ language: stored as Language });
      }
    } catch {
      console.log("[ErrorBoundary] Could not load language preference");
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    try {
      const { router } = require("expo-router");
      router.replace("/");
    } catch {
      console.log("[ErrorBoundary] Could not navigate home");
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const strings = ERROR_STRINGS[this.state.language] ?? ERROR_STRINGS.en;

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>IRIS</Text>
            </View>

            <View style={styles.iconContainer}>
              <ShieldAlert size={36} color="#B8A4E8" strokeWidth={1.5} />
            </View>

            <Text style={styles.title}>{strings.title}</Text>
            <Text style={styles.message}>{strings.message}</Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorLabel}>DEV</Text>
                <Text style={styles.errorText} numberOfLines={8}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={this.handleReset}
                activeOpacity={0.7}
                testID="error-boundary-retry"
              >
                <RefreshCw size={17} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>{strings.tryAgain}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={this.handleGoHome}
                activeOpacity={0.7}
                testID="error-boundary-go-home"
              >
                <Home size={17} color="#B8A4E8" />
                <Text style={styles.secondaryButtonText}>{strings.goHome}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F4",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 28,
  },
  content: {
    alignItems: "center" as const,
    maxWidth: 340,
    width: "100%" as const,
  },
  brandRow: {
    marginBottom: 32,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#B8A4E8",
    letterSpacing: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0EBF8",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E8E4EC",
  },
  title: {
    fontSize: 21,
    fontWeight: "700" as const,
    color: "#2D2440",
    marginBottom: 10,
    textAlign: "center" as const,
  },
  message: {
    fontSize: 15,
    color: "#7A7086",
    textAlign: "center" as const,
    lineHeight: 22,
    marginBottom: 28,
  },
  errorBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    width: "100%" as const,
    borderWidth: 1,
    borderColor: "#E8E4EC",
  },
  errorLabel: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#B8A4E8",
    letterSpacing: 1,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#E89BA4",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 18,
  },
  buttonGroup: {
    width: "100%" as const,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#B8A4E8",
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  secondaryButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#F0EBF8",
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8E4EC",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#B8A4E8",
  },
});
