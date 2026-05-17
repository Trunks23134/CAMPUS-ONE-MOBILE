import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Footer from "./Footer";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type LandingPageProps = {
  isDarkMode: boolean;
  theme: AppTheme;
  onContinue: () => void;
};

export default function LandingPage({ theme, onContinue }: LandingPageProps): React.JSX.Element {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.pageBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.phoneFrame, { backgroundColor: theme.phoneFrameBackground }]}>
          <PortalHeader theme={theme}>
            <Text style={styles.brandTitle}>
              <Text style={[styles.brandAccent, { color: theme.topBarAccent }]}>CAMPUS </Text>
              <Text style={[styles.brandText, { color: theme.topBarText }]}>Portal</Text>
            </Text>
          </PortalHeader>

          <View style={[styles.sectionWhite, { backgroundColor: theme.phoneFrameBackground }]}>
            <View style={styles.titleRow}>
              <View style={[styles.titleBar, { backgroundColor: theme.topBarAccent }]} />
              <Text style={[styles.titleText, { color: theme.topBarAccent }]}>OFFICE OF{"\n"}ALUMNI RELATIONS</Text>
            </View>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Unifying generations of Campus One graduates in a shared commitment to global service,
              faith, and nation-building.
            </Text>
          </View>

          <View style={[styles.sectionGray, { backgroundColor: theme.sectionBackground }]}>
            <View style={[styles.serviceCard, { backgroundColor: theme.sectionCardBackground }]}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>ID</Text>
              </View>

              <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>Alumni Services</Text>
              <Text style={[styles.serviceDescription, { color: theme.textMuted }]}>
                Explore alumni card application{"\n"}and document request services{"\n"}from one place
              </Text>

              <Pressable onPress={onContinue} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            </View>
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
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  brandAccent: {
    fontSize: 18,
    fontWeight: "800",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionWhite: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    gap: 14,
  },
  titleBar: {
    width: 5,
    borderRadius: 3,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 30,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    marginTop: 16,
  },
  sectionGray: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  serviceCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    color: "#C8860A",
    fontWeight: "700",
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 22,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#F5A623",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
});
