import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Footer from "./Footer";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type LoginPageProps = {
  isDarkMode: boolean;
  theme: AppTheme;
  onBack: () => void;
  onRegister: () => void;
  onLogin: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ theme, onBack, onRegister, onLogin }: LoginPageProps): React.JSX.Element {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (): void => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onLogin();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.pageBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.phoneFrame, { backgroundColor: theme.phoneFrameBackground }]}>
          <PortalHeader theme={theme} leftAction={{ icon: "arrow-left", onPress: onBack, accessibilityLabel: "Go back" }}>
            <Text style={[styles.topTitle, { color: theme.topBarText }]}>Log In</Text>
          </PortalHeader>

          <View style={[styles.bannerWrap, { backgroundColor: theme.topBarBackground }]}>
            <View style={[styles.bannerCard, { backgroundColor: theme.sectionCardSecondary }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AL</Text>
              </View>
              <View style={styles.bannerTextWrap}>
                <Text style={[styles.bannerTitle, { color: theme.topBarText }]}>WELCOME BACK,</Text>
                <Text style={[styles.bannerHighlight, { color: theme.topBarAccent }]}>ALUMNI!</Text>
                <Text style={[styles.bannerSubtitle, { color: theme.textMuted }]}>
                  Sign in to access your alumni account and services
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.formArea, { backgroundColor: theme.sectionBackground }]}>
            <View style={[styles.formCard, { backgroundColor: theme.sectionCardBackground }]}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Email Address *</Text>
                <TextInput
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (emailError) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.inputBorder,
                      color: theme.textPrimary,
                    },
                    emailError ? styles.inputError : null,
                  ]}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Password *</Text>
                <View style={styles.passwordWrap}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.textMuted}
                    style={[
                      styles.passwordInput,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                  <Pressable onPress={() => setShowPass((prev) => !prev)} style={styles.eyeButton} hitSlop={8}>
                    <MaterialCommunityIcons
                      name={showPass ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={theme.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.rememberRow}>
                <View style={styles.rememberWrap}>
                  <Switch value={rememberMe} onValueChange={setRememberMe} />
                  <Text style={[styles.rememberText, { color: theme.textPrimary }]}>Remember me</Text>
                </View>
                <Text style={[styles.forgotText, { color: theme.topBarAccent }]}>Forgot Password?</Text>
              </View>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Log In</Text>
            </Pressable>

            <View style={styles.centerRow}>
              <Text style={[styles.secondaryText, { color: theme.textMuted }]}>Don't have an account? </Text>
              <Pressable onPress={onRegister}>
                <Text style={[styles.linkText, { color: theme.topBarAccent }]}>Register</Text>
              </Pressable>
            </View>

            <Text style={[styles.helpText, { color: theme.textSecondary }]}>Need Help?</Text>
          </View>

          <Footer theme={theme} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 375,
    maxWidth: "95%",
    borderRadius: 40,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backArrow: {
    fontSize: 22,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  bannerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bannerCard: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#666666",
    fontWeight: "800",
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  bannerHighlight: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  formArea: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  formCard: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 5,
  },
  passwordWrap: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 44,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberText: {
    fontSize: 13,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#F5A623",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryText: {
    fontSize: 14,
  },
  linkText: {
    fontWeight: "700",
  },
  helpText: {
    textAlign: "center",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
