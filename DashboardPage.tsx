import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Footer from "./Footer";
import PortalHeader from "./PortalHeader";
import ProfilePage from "./ProfilePage";
import CardApplicationPage from "./CardApplicationPage";
import DocumentRequestPage from "./DocumentRequestPage";
import ClearanceTrackerPage from "./ClearanceTrackerPage";
import { AppTheme } from "./theme";

type DashboardTab = "home" | "card" | "documents" | "clearance" | "profile";

type DashboardPageProps = {
  isDarkMode: boolean;
  theme: AppTheme;
  onToggleDarkMode: (value: boolean) => void;
  onSignOut: () => void;
  userName?: string;
  userFullName?: string;
  userEmail?: string;
  userInitials?: string;
};

type NavItem = {
  tab: DashboardTab;
  label: string;
  subtitle: string;
  icon: string;
};

const primaryNavItems: NavItem[] = [
  { tab: "home", label: "Home", subtitle: "Dashboard overview", icon: "view-dashboard-outline" },
  { tab: "card", label: "Alumni Card", subtitle: "Start or continue your ID request", icon: "card-account-details-outline" },
  { tab: "documents", label: "Documents", subtitle: "Request official records", icon: "file-document-multiple-outline" },
  { tab: "clearance", label: "Clearance Tracker", subtitle: "Monitor routing progress", icon: "clipboard-text-clock-outline" },
  { tab: "profile", label: "Profile", subtitle: "Manage your account", icon: "account-circle-outline" },
];

export default function DashboardPage({
  isDarkMode,
  theme,
  onToggleDarkMode,
  onSignOut,
  userName = "John",
  userFullName = "John Doe",
  userEmail = "jertznaval57@gmail.com",
  userInitials = "JD",
}: DashboardPageProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const navigateTo = (tab: DashboardTab): void => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.pageBackground }]}>
      <View style={[styles.phoneFrame, { backgroundColor: theme.phoneFrameBackground }]}>
        {activeTab === "profile" ? (
          <ProfilePage
            onBack={() => setActiveTab("home")}
            isDarkMode={isDarkMode}
            theme={theme}
            onToggleDarkMode={onToggleDarkMode}
            onSignOut={onSignOut}
            userFullName={userFullName}
            userEmail={userEmail}
          />
        ) : activeTab === "card" ? (
          <CardApplicationPage
            theme={theme}
            onBack={() => setActiveTab("home")}
            userFullName={userFullName}
            userEmail={userEmail}
          />
        ) : activeTab === "documents" ? (
          <DocumentRequestPage theme={theme} onBack={() => setActiveTab("home")} />
        ) : activeTab === "clearance" ? (
          <ClearanceTrackerPage theme={theme} onBack={() => setActiveTab("home")} />
        ) : (
          <>
            <PortalHeader
              theme={theme}
              leftAction={{ icon: "menu", onPress: () => setDrawerOpen(true), accessibilityLabel: "Open menu" }}
              rightActions={[{ icon: "bell-outline", accessibilityLabel: "Notifications", badge: true }]}
            >
              <Text style={styles.brandTitle}>
                <Text style={[styles.brandAccent, { color: theme.topBarAccent }]}>CAMPUS </Text>
                <Text style={[styles.brandText, { color: theme.topBarText }]}>Portal</Text>
              </Text>
            </PortalHeader>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.dashboardIntro, { backgroundColor: theme.sectionBackground }]}> 
                <Text style={[styles.dashboardTitle, { color: theme.textPrimary }]}>Dashboard</Text>
                <Text style={[styles.dashboardSubtitle, { color: theme.textSecondary }]}>Welcome back, Alumni Member</Text>
              </View>

              <View style={[styles.content, { backgroundColor: theme.sectionBackground }]}>
                <SectionHeader title="Overview" theme={theme} />
                <View style={styles.overviewGrid}>
                  <StatCard icon="compass-outline" iconBg="#4A90D9" label="Member Since" value="2024" theme={theme} />
                  <StatCard icon="shield-check-outline" iconBg="#4CAF50" label="Services Used" value="0" theme={theme} />
                  <StatCard icon="account-group-outline" iconBg="#7C4DFF" label="Alumni Network" value="5,420" theme={theme} />
                  <StatCard icon="chart-timeline-variant" iconBg={theme.topBarAccent} label="Profile Status" value="Active" theme={theme} />
                </View>

                <SectionHeader title="Quick Actions" theme={theme} />
                <View style={styles.actionsWrap}>
                  <Pressable style={styles.actionCardYellow} onPress={() => setActiveTab("card")}>
                    <View style={styles.actionIconDark}>
                      <MaterialCommunityIcons name="card-account-details-outline" size={22} color="#F5A623" />
                    </View>
                    <View style={styles.actionTextWrap}>
                      <Text style={styles.actionTitleDark}>Apply for Alumni Card</Text>
                      <Text style={styles.actionSubDark}>Get your official alumni identification</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#111111" />
                  </Pressable>

                  <Pressable
                    style={[styles.actionCardDark, { backgroundColor: theme.sectionCardSecondary }]}
                    onPress={() => setActiveTab("documents")}
                  >
                    <View style={[styles.actionIconYellow, { backgroundColor: theme.topBarAccent }]}>
                      <MaterialCommunityIcons name="folder-multiple-outline" size={22} color="#111111" />
                    </View>
                    <View style={styles.actionTextWrap}>
                      <Text style={[styles.actionTitleLight, { color: theme.topBarText }]}>Request Documents</Text>
                      <Text style={[styles.actionSubLight, { color: theme.textMuted }]}>Order official transcripts and certificates</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={theme.topBarText} />
                  </Pressable>

                  <Pressable
                    style={[styles.actionCardDark, { backgroundColor: theme.sectionCardSecondary }]}
                    onPress={() => setActiveTab("clearance")}
                  >
                    <View style={[styles.actionIconBlue, { backgroundColor: "#1E88E5" }]}>
                      <MaterialCommunityIcons name="clipboard-text-clock-outline" size={22} color="#FFFFFF" />
                    </View>
                    <View style={styles.actionTextWrap}>
                      <Text style={[styles.actionTitleLight, { color: theme.topBarText }]}>Track Clearance Routing</Text>
                      <Text style={[styles.actionSubLight, { color: theme.textMuted }]}>Monitor Library, Finance, Dean, and Labs sign-offs</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={theme.topBarText} />
                  </Pressable>
                </View>

                <SectionHeader title="Recent Activity" theme={theme} />
                <View style={[styles.activityCard, { backgroundColor: theme.sectionCardBackground }]}>
                  <ActivityItem
                    icon="account-check-outline"
                    iconBg="#4CAF50"
                    label="Account Created"
                    sub="Your portal account is ready to use"
                    timestamp="Just now"
                    theme={theme}
                  />
                  <ActivityItem
                    icon="badge-account-horizontal-outline"
                    iconBg="#4A90D9"
                    label="Profile Completed"
                    sub="Personal and contact details saved"
                    timestamp="Today"
                    theme={theme}
                  />
                </View>

                <SectionHeader title="Profile" theme={theme} />
                <View style={[styles.profileCard, { backgroundColor: theme.sectionCardBackground }]}>
                  <View style={styles.profileRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{userInitials}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, { color: theme.textPrimary }]}>{userFullName}</Text>
                      <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{userEmail}</Text>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.profileButton, { backgroundColor: theme.sectionCardSecondary }]}
                    onPress={() => setActiveTab("profile")}
                  >
                    <Text style={[styles.profileButtonText, { color: theme.topBarText }]}>View Full Profile</Text>
                  </Pressable>
                </View>
              </View>

              <Footer theme={theme} />
            </ScrollView>
          </>
        )}

        <View style={[styles.tabBar, { backgroundColor: theme.tabBarBackground, borderTopColor: theme.tabBarBorder }]}>
          <TabItem icon="home" label="Home" active={activeTab === "home"} theme={theme} onPress={() => setActiveTab("home")} />
          <TabItem icon="card-account-details-outline" label="Card" active={activeTab === "card"} theme={theme} onPress={() => setActiveTab("card")} />
          <TabItem icon="file-document-outline" label="Docs" active={activeTab === "documents"} theme={theme} onPress={() => setActiveTab("documents")} />
          <TabItem icon="clipboard-text-clock-outline" label="Track" active={activeTab === "clearance"} theme={theme} onPress={() => setActiveTab("clearance")} />
          <TabItem icon="account-outline" label="Profile" active={activeTab === "profile"} theme={theme} onPress={() => setActiveTab("profile")} />
        </View>
      </View>

      <DrawerMenu
        open={drawerOpen}
        activeTab={activeTab}
        theme={theme}
        onClose={() => setDrawerOpen(false)}
        onNavigate={navigateTo}
        onLogOut={onSignOut}
      />
    </SafeAreaView>
  );
}

function DrawerMenu({
  open,
  activeTab,
  theme,
  onClose,
  onNavigate,
  onLogOut,
}: {
  open: boolean;
  activeTab: DashboardTab;
  theme: AppTheme;
  onClose: () => void;
  onNavigate: (tab: DashboardTab) => void;
  onLogOut: () => void;
}): React.JSX.Element {
  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.drawerOverlay}>
        <Pressable style={styles.drawerBackdrop} onPress={onClose} />

        <View style={styles.drawerShell}>
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerBrand}>CAMPUS Portal</Text>
                <Text style={styles.drawerSubhead}>Mobile navigation</Text>
              </View>
              <Pressable hitSlop={8} style={styles.drawerCloseButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={22} color="#F5F7FA" />
              </Pressable>
            </View>

            <View style={styles.drawerNav}>
              {primaryNavItems.map((item) => {
                const active = activeTab === item.tab;
                return (
                  <Pressable
                    key={item.tab}
                    style={[styles.drawerItem, active && styles.drawerItemActive]}
                    onPress={() => onNavigate(item.tab)}
                  >
                    <View style={[styles.drawerIconWrap, active && styles.drawerIconWrapActive]}>
                      <MaterialCommunityIcons
                        name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                        size={22}
                        color={active ? "#111111" : "#F5F7FA"}
                      />
                    </View>

                    <View style={styles.drawerCopy}>
                      <Text style={[styles.drawerLabel, active && styles.drawerLabelActive]}>{item.label}</Text>
                      <Text style={[styles.drawerSubtitle, active && styles.drawerSubtitleActive]}>{item.subtitle}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterTitle}>Quick Tabs</Text>

              <Pressable style={styles.quickTab} onPress={() => onNavigate("profile")}>
                <View style={styles.quickTabIcon}>
                  <MaterialCommunityIcons name="cog-outline" size={20} color="#F5F7FA" />
                </View>
                <Text style={styles.quickTabLabel}>Settings</Text>
              </Pressable>

              <Pressable style={styles.quickTab} onPress={onLogOut}>
                <View style={[styles.quickTabIcon, styles.quickTabDangerIcon]}>
                  <MaterialCommunityIcons name="logout" size={20} color="#C98585" />
                </View>
                <Text style={styles.quickTabDangerLabel}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SectionHeader({ title, theme }: { title: string; theme: AppTheme }): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
      <View style={[styles.sectionUnderline, { backgroundColor: theme.topBarAccent }]} />
    </View>
  );
}

type StatCardProps = {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  theme: AppTheme;
};

function StatCard({ icon, iconBg, label, value, theme }: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.sectionCardBackground }]}>
      <View style={[styles.statIconWrap, { backgroundColor: `${iconBg}18` }]}>
        <View style={[styles.statIconCore, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]} size={20} color="#FFFFFF" />
        </View>
      </View>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

type ActivityItemProps = {
  icon: string;
  iconBg: string;
  label: string;
  sub: string;
  timestamp: string;
  theme: AppTheme;
};

function ActivityItem({ icon, iconBg, label, sub, timestamp, theme }: ActivityItemProps): React.JSX.Element {
  return (
    <View style={[styles.activityItem, { borderBottomColor: theme.divider }]}>
      <View style={[styles.activityIconWrap, { backgroundColor: `${iconBg}16` }]}>
        <MaterialCommunityIcons name={icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]} size={20} color={iconBg} />
      </View>

      <View style={styles.activityTextWrap}>
        <Text style={[styles.activityLabel, { color: theme.textPrimary }]}>{label}</Text>
        <Text style={[styles.activitySub, { color: theme.textMuted }]}>{sub}</Text>
      </View>

      <Text style={[styles.activityTime, { color: theme.textMuted }]}>{timestamp}</Text>
    </View>
  );
}

type TabItemProps = {
  icon: string;
  label: string;
  active: boolean;
  theme: AppTheme;
  onPress: () => void;
};

function TabItem({ icon, label, active, theme, onPress }: TabItemProps): React.JSX.Element {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <MaterialCommunityIcons name={icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]} size={24} color={active ? theme.topBarAccent : theme.tabInactive} />
      <Text style={[styles.tabLabel, { color: active ? theme.topBarAccent : theme.tabInactive }, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneFrame: {
    width: 375,
    maxWidth: "95%",
    flex: 1,
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
  dashboardIntro: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dashboardTitle: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  dashboardSubtitle: {
    fontSize: 15,
    marginTop: 6,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  sectionUnderline: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "47.5%",
    borderRadius: 18,
    padding: 16,
  },
  statIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIconCore: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  actionsWrap: {
    gap: 10,
    marginBottom: 20,
  },
  actionCardYellow: {
    backgroundColor: "#F5A623",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  actionCardDark: {
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  actionIconDark: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconYellow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconBlue: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitleDark: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  actionSubDark: {
    color: "#333333",
    fontSize: 12,
    marginTop: 3,
  },
  actionTitleLight: {
    fontSize: 15,
    fontWeight: "700",
  },
  actionSubLight: {
    fontSize: 12,
    marginTop: 3,
  },
  activityCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTextWrap: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  activitySub: {
    fontSize: 12,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: "600",
  },
  profileCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F5A623",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#111111",
    fontWeight: "800",
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  profileButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  profileButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerShell: {
    width: 304,
    maxWidth: "84%",
    height: "100%",
  },
  drawerPanel: {
    flex: 1,
    backgroundColor: "#111315",
    paddingTop: 56,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 26,
  },
  drawerBrand: {
    color: "#F5F7FA",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  drawerSubhead: {
    color: "#8B949F",
    fontSize: 12,
    marginTop: 6,
  },
  drawerCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerNav: {
    flex: 1,
    gap: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  drawerItemActive: {
    backgroundColor: "#F5A623",
  },
  drawerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  drawerIconWrapActive: {
    backgroundColor: "rgba(17,17,17,0.12)",
  },
  drawerCopy: {
    flex: 1,
  },
  drawerLabel: {
    color: "#F5F7FA",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  drawerLabelActive: {
    color: "#111111",
  },
  drawerSubtitle: {
    color: "#98A2AE",
    fontSize: 12,
    lineHeight: 18,
  },
  drawerSubtitleActive: {
    color: "#362200",
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 18,
    gap: 10,
  },
  drawerFooterTitle: {
    color: "#AEB7C2",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  quickTab: {
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  quickTabIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  quickTabDangerIcon: {
    backgroundColor: "rgba(201,133,133,0.12)",
  },
  quickTabLabel: {
    color: "#F5F7FA",
    fontSize: 14,
    fontWeight: "700",
  },
  quickTabDangerLabel: {
    color: "#C98585",
    fontSize: 14,
    fontWeight: "700",
  },
});
