import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type ProfilePageProps = {
  onBack: () => void;
  isDarkMode: boolean;
  theme: AppTheme;
  onToggleDarkMode: (value: boolean) => void;
  onSignOut: () => void;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
  academicUnit?: string;
  graduationYear?: string;
  phone?: string;
};

type SettingsRowProps = {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  theme: AppTheme;
  onPress?: () => void;
  trailing?: React.ReactNode;
};

const termsSections = [
  {
    title: "Acceptance of Terms",
    body: "By using the Campus One Alumni Portal, you agree to comply with platform rules, provide accurate account information, and use alumni services responsibly.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for all activity under your account and for keeping your password and sign-in credentials secure.",
  },
  {
    title: "Service Availability",
    body: "Campus One may improve, update, or temporarily suspend services as needed for maintenance, security, or policy compliance.",
  },
  {
    title: "Policy Updates",
    body: "Terms may be revised from time to time. Continued use of the portal after updates means you accept the revised terms.",
  },
];

const privacySections = [
  {
    title: "Personal Data Collected",
    body: "Campus One collects profile, academic, and service-request information necessary to verify alumni identity and provide alumni support services.",
  },
  {
    title: "Purpose of Processing",
    body: "Your information is used for account administration, request processing, service communication, and maintenance of official alumni records.",
  },
  {
    title: "Data Protection",
    body: "Reasonable safeguards are applied to protect stored personal information from unauthorized access, disclosure, alteration, or misuse.",
  },
];

export default function ProfilePage({
  onBack,
  isDarkMode,
  theme,
  onToggleDarkMode,
  onSignOut,
  userFullName = "John Doe",
  userEmail = "hhfjj@gmail.com",
  studentId = "2020-12345",
  academicUnit = "Faculty of Engineering",
  graduationYear = "2024",
  phone = "+63 945 111 0101",
}: ProfilePageProps): React.JSX.Element {
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePolicy, setActivePolicy] = useState<"terms" | "privacy" | null>(null);

  const searchItems: SearchItem[] = [
    { title: "Change Password", subtitle: "Update your account password" },
    { title: "Push Notifications", subtitle: "Receive app notifications" },
    { title: "Email Notifications", subtitle: "Receive updates via email" },
    { title: "Dark Mode", subtitle: "Enable dark theme" },
    { title: "Privacy Policy", subtitle: "View our privacy policy" },
    { title: "Terms & Conditions", subtitle: "View terms of service" },
    { title: "Download My Data", subtitle: "Export your personal data" },
    { title: "Log Out", subtitle: "Return to the landing page", onPress: onSignOut },
  ];

  const filteredItems = searchItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return false;
    }

    return `${item.title} ${item.subtitle}`.toLowerCase().includes(query);
  });

  const toggleSearch = (): void => {
    setSearchOpen((prev) => !prev);
    setSearchQuery("");
  };

  return (
    <>
      <PortalHeader
        theme={theme}
        leftAction={{ icon: "arrow-left", onPress: onBack, accessibilityLabel: "Go back" }}
        rightActions={[
          { icon: "magnify", onPress: toggleSearch, accessibilityLabel: "Search" },
          { icon: "bell-outline", accessibilityLabel: "Notifications", badge: true },
        ]}
      >
        <Text style={[styles.topTitle, { color: theme.topBarText }]}>Settings</Text>
      </PortalHeader>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.sectionBackground }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {searchOpen ? (
          <View style={styles.searchWrap}>
            <View style={[styles.searchInputWrap, { backgroundColor: theme.sectionCardBackground, borderColor: theme.divider }]}>
              <MaterialCommunityIcons name="magnify" size={18} color={theme.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search settings"
                placeholderTextColor={theme.textMuted}
                style={[styles.searchInput, { color: theme.textPrimary }]}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={theme.textMuted} />
                </Pressable>
              ) : null}
            </View>

            <SearchResults items={filteredItems} theme={theme} emptyLabel="No settings matches found." />
          </View>
        ) : null}

        <View style={styles.profileHero}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account-outline" size={42} color="#111111" />
            </View>

            <View style={styles.identityWrap}>
              <Text style={styles.name}>{userFullName}</Text>
              <Text style={styles.email}>{userEmail}</Text>
              <Text style={styles.studentId}>Student ID: {studentId}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <InfoRow label="Academic Unit" value={academicUnit} highlight />
            <InfoRow label="Graduation Year" value={graduationYear} highlight />
            <InfoRow label="Phone" value={phone} />
          </View>
        </View>

        <SettingsSection title="Account" theme={theme}>
          <SettingsRow
            icon="lock-outline"
            title="Change Password"
            subtitle="Update your account password"
            theme={theme}
            trailing={<MaterialCommunityIcons name="chevron-right" size={28} color="#A5AFBF" />}
          />
        </SettingsSection>

        <SettingsSection title="Notifications" theme={theme}>
          <SettingsRow
            icon="bell-outline"
            title="Push Notifications"
            subtitle="Receive app notifications"
            theme={theme}
            trailing={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                thumbColor="#ffffff"
                trackColor={{ false: "#D6DBE5", true: "#F5B400" }}
                ios_backgroundColor="#D6DBE5"
              />
            }
          />
          <SettingsRow
            icon="email-outline"
            title="Email Notifications"
            subtitle="Receive updates via email"
            theme={theme}
            trailing={
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                thumbColor="#ffffff"
                trackColor={{ false: "#D6DBE5", true: "#F5B400" }}
                ios_backgroundColor="#D6DBE5"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Preferences" theme={theme}>
          <SettingsRow
            icon="moon-waning-crescent"
            title="Dark Mode"
            subtitle="Enable dark theme"
            theme={theme}
            trailing={
              <Switch
                value={isDarkMode}
                onValueChange={onToggleDarkMode}
                thumbColor="#ffffff"
                trackColor={{ false: "#D6DBE5", true: "#F5B400" }}
                ios_backgroundColor="#D6DBE5"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Privacy & Security" theme={theme}>
          <SettingsRow
            icon="shield-outline"
            title="Privacy Policy"
            subtitle="View our privacy policy"
            theme={theme}
            onPress={() => setActivePolicy("privacy")}
            trailing={<MaterialCommunityIcons name="chevron-right" size={28} color="#A5AFBF" />}
          />
          <SettingsRow
            icon="shield-check-outline"
            title="Terms & Conditions"
            subtitle="View terms of service"
            theme={theme}
            onPress={() => setActivePolicy("terms")}
            trailing={<MaterialCommunityIcons name="chevron-right" size={28} color="#A5AFBF" />}
          />
          <SettingsRow
            icon="download-outline"
            title="Download My Data"
            subtitle="Export your personal data"
            theme={theme}
            trailing={<MaterialCommunityIcons name="chevron-right" size={28} color="#A5AFBF" />}
          />
        </SettingsSection>

        <Pressable style={styles.signOutButton} onPress={onSignOut}>
          <MaterialCommunityIcons name="logout" size={24} color="#C98585" />
          <Text style={styles.signOutText}>Log Out</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={[styles.footerTitle, { color: theme.textMuted }]}>Campus One Alumni Relations</Text>
          <Text style={[styles.footerVersion, { color: theme.textMuted }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <PolicyModal
        open={activePolicy !== null}
        title={activePolicy === "privacy" ? "Privacy Policy" : "Terms and Conditions"}
        sections={activePolicy === "privacy" ? privacySections : termsSections}
        theme={theme}
        onClose={() => setActivePolicy(null)}
      />
    </>
  );
}

type SearchItem = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function SearchResults({
  items,
  theme,
  emptyLabel,
}: {
  items: SearchItem[];
  theme: AppTheme;
  emptyLabel: string;
}): React.JSX.Element | null {
  if (!items.length) {
    return (
      <View style={[styles.searchResultsCard, { backgroundColor: theme.sectionCardBackground }]}>
        <Text style={[styles.searchEmptyText, { color: theme.textMuted }]}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.searchResultsCard, { backgroundColor: theme.sectionCardBackground }]}>
      {items.map((item, index) => (
        <Pressable
          key={item.title}
          style={[
            styles.searchResultItem,
            index < items.length - 1 ? { borderBottomColor: theme.divider, borderBottomWidth: 1 } : null,
          ]}
          onPress={item.onPress}
        >
          <View style={styles.searchResultTextWrap}>
            <Text style={[styles.searchResultTitle, { color: theme.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.searchResultSubtitle, { color: theme.textMuted }]}>{item.subtitle}</Text>
          </View>
          <MaterialCommunityIcons name="arrow-top-right" size={18} color={theme.topBarAccent} />
        </Pressable>
      ))}
    </View>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
    </View>
  );
}

function SettingsSection({
  title,
  theme,
  children,
}: {
  title: string;
  theme: AppTheme;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
      <View style={[styles.sectionDivider, { backgroundColor: theme.divider }]} />
      {children}
    </View>
  );
}

function SettingsRow({
  icon,
  iconColor = "#D89200",
  title,
  subtitle,
  theme,
  onPress,
  trailing,
}: SettingsRowProps): React.JSX.Element {
  return (
    <Pressable style={[styles.settingRow, { borderTopColor: theme.divider }]} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>
          <MaterialCommunityIcons name={icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]} size={26} color={iconColor} />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.trailingWrap}>{trailing}</View>
    </Pressable>
  );
}

function PolicyModal({
  open,
  title,
  sections,
  theme,
  onClose,
}: {
  open: boolean;
  title: string;
  sections: { title: string; body: string }[];
  theme: AppTheme;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.sectionCardBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={theme.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            {sections.map((section) => (
              <View key={section.title} style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>{section.title}</Text>
                <Text style={[styles.modalSectionBody, { color: theme.textMuted }]}>{section.body}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 16,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bellWrap: {
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  searchWrap: {
    marginBottom: 14,
  },
  searchInputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  searchResultsCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  searchResultTextWrap: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  searchResultSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  searchEmptyText: {
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  profileHero: {
    backgroundColor: "#121822",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#F5B400",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  identityWrap: {
    flex: 1,
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  email: {
    color: "#D9DEE8",
    fontSize: 13,
    marginBottom: 4,
  },
  studentId: {
    color: "#97A1B3",
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: "#0D121B",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    gap: 12,
  },
  infoLabel: {
    color: "#D9DEE8",
    fontSize: 13,
    flex: 1,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    flex: 1.4,
    textAlign: "right",
  },
  infoValueHighlight: {
    color: "#F5B400",
  },
  sectionCard: {
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
  },
  sectionDivider: {
    height: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderTopWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  settingIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF4BF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  trailingWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#2A1717",
    borderWidth: 1,
    borderColor: "rgba(201,133,133,0.35)",
    borderRadius: 18,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 22,
  },
  signOutText: {
    color: "#C98585",
    fontSize: 17,
    fontWeight: "800",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 8,
  },
  footerTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  modalCard: {
    borderRadius: 20,
    maxHeight: "82%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
    marginRight: 12,
  },
  modalScroll: {
    maxHeight: 420,
  },
  modalContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  modalSectionBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalButton: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: "#F5A623",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
});
