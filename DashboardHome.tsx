import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";
import {
  getActiveRequests,
  getCompletedRequests,
  getPendingPayments,
  getReadyForPickupRequests,
  mockPayments,
  mockRequests,
} from "./portalData";
import type { HeaderIconName } from "./PortalHeader";

type DashboardTone = "blue" | "green" | "amber" | "violet";
type DashboardIcon = "calendar-month-outline" | "folder-outline" | "shield-check-outline";

type SummaryCard = {
  tone: DashboardTone;
  icon: DashboardIcon;
  value: string;
  label: string;
  action: string;
  onPress?: () => void;
};

type QuickAction = {
  icon: DashboardIcon;
  title: string;
  description: string;
  onPress: () => void;
};

type DashboardHomeProps = {
  theme: AppTheme;
  onOpenMenu: () => void;
  onOpenCardApplication: () => void;
  onOpenDocuments: () => void;
  onOpenClearance: () => void;
  userDisplayName?: string;
};

function toneStyle(tone: DashboardTone): { backgroundColor: string; color: string } {
  if (tone === "green") {
    return { backgroundColor: "#E6F7EE", color: "#1F9D57" };
  }

  if (tone === "amber") {
    return { backgroundColor: "#FFF3DD", color: "#D48806" };
  }

  if (tone === "violet") {
    return { backgroundColor: "#F1ECFF", color: "#7B5CE5" };
  }

  return { backgroundColor: "#E9F1FF", color: "#2F6FED" };
}

function DashboardIconView({ icon, color }: { icon: DashboardIcon; color: string }): React.JSX.Element {
  return <MaterialCommunityIcons name={icon} size={20} color={color} />;
}

export default function DashboardHome({
  theme,
  onOpenMenu,
  onOpenCardApplication,
  onOpenDocuments,
  onOpenClearance,
  userDisplayName = "Pio Felipe Ramirez",
}: DashboardHomeProps): React.JSX.Element {
  const nameParts = userDisplayName.trim().split(/\s+/).filter(Boolean);
  const greetingName =
    nameParts.length === 0
      ? "Pio Felipe Ramirez"
      : nameParts.length === 1
        ? nameParts[0]
        : `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;

  const activeCount = getActiveRequests(mockRequests).length;
  const completedCount = getCompletedRequests(mockRequests).length;
  const pickupCount = getReadyForPickupRequests(mockRequests).length;
  const paymentCount = getPendingPayments(mockPayments).length;

  const summaryCards: SummaryCard[] = [
    {
      tone: "violet",
      icon: "folder-outline",
      value: activeCount.toString(),
      label: "Active applications",
      action: "View cards",
      onPress: onOpenCardApplication,
    },
    {
      tone: "blue",
      icon: "calendar-month-outline",
      value: paymentCount.toString(),
      label: "Pending payments",
      action: "Review invoices",
      onPress: onOpenDocuments,
    },
    {
      tone: "amber",
      icon: "folder-outline",
      value: pickupCount.toString(),
      label: "Items for pickup",
      action: "Arrange pickup",
      onPress: onOpenDocuments,
    },
    {
      tone: "green",
      icon: "shield-check-outline",
      value: completedCount.toString(),
      label: "Completed requests",
      action: "View history",
      onPress: onOpenClearance,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: "folder-outline",
      title: "Request documents",
      description: "Order transcripts, diplomas, or other documents.",
      onPress: onOpenDocuments,
    },
    {
      icon: "calendar-month-outline",
      title: "Apply for alumni card",
      description: "Get your official alumni identification card.",
      onPress: onOpenCardApplication,
    },
    {
      icon: "shield-check-outline",
      title: "View clearance status",
      description: "Check the status of background clearance requests.",
      onPress: onOpenClearance,
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.sectionBackground }]}>
      <PortalHeader
        theme={theme}
        leftAction={{ icon: "menu", accessibilityLabel: "Open navigation menu", onPress: onOpenMenu }}
        rightActions={[{ icon: "bell-outline" as HeaderIconName, accessibilityLabel: "Notifications", badge: true }]}
      >
        <Text style={[styles.brandTitle, { color: theme.topBarText }]}>Dashboard</Text>
      </PortalHeader>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Dashboard</Text>
          <Text style={[styles.heroLead, { color: theme.textSecondary }]}>Welcome back, {greetingName} 👋</Text>
        </View>

        <View style={styles.summaryGrid} accessibilityLabel="Dashboard summary">
          {summaryCards.map((card) => {
            const tone = toneStyle(card.tone);

            return (
              <Pressable
                key={card.label}
                style={[styles.summaryCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder, shadowColor: theme.cardShadow }]}
                onPress={card.onPress}
              >
                <View style={[styles.summaryIcon, { backgroundColor: tone.backgroundColor }]}>
                  <DashboardIconView icon={card.icon} color={tone.color} />
                </View>

                <View style={styles.summaryCopy}>
                  <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{card.value}</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{card.label}</Text>
                  <Text style={[styles.summaryAction, { color: tone.color }]}>
                    {card.action}
                    <Text accessibilityElementsHidden style={styles.summaryArrow}> →</Text>
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.contentGrid}>
          <View style={[styles.card, styles.statusCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder, shadowColor: theme.cardShadow }]}>
            <View style={styles.cardHead}>
              <View>
                <Text style={[styles.cardKicker, { color: theme.textSecondary }]}>Your requests</Text>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Application overview</Text>
              </View>
            </View>

            <View style={styles.statusList}>
              {mockRequests.slice(0, 3).map((request) => {
                const paymentUnderReview = mockPayments.find((payment) => payment.requestId === request.id && payment.status === "under_verification");
                const displayStatus = paymentUnderReview ? "Under Verification" : request.status;
                const pillStyle =
                  paymentUnderReview
                    ? styles.verificationPill
                    : request.status === "Processing"
                      ? styles.openPill
                      : request.status === "Ready for Pickup"
                        ? styles.readyPill
                        : styles.shippedPill;

                return (
                  <View key={request.id} style={styles.statusRow}>
                    <View>
                      <Text style={[styles.statusTitle, { color: theme.textPrimary }]}>{request.title}</Text>
                      <Text style={[styles.statusSubtitle, { color: theme.textSecondary }]}>{request.serviceType}</Text>
                    </View>
                    <Text style={[styles.statusPill, pillStyle]}>{displayStatus}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressHead}>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Most urgent: Alumni Card Application</Text>
                <Text style={[styles.progressPercent, { color: theme.textPrimary }]}>25%</Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: "rgba(0, 0, 0, 0.08)" }]}>
                <View style={[styles.progressFill, { width: "25%", backgroundColor: theme.topBarAccent }]} />
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.actionsCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder, shadowColor: theme.cardShadow }]}>
            <View style={styles.cardHead}>
              <View>
                <Text style={[styles.cardKicker, { color: theme.textSecondary }]}>Quick actions</Text>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Move faster</Text>
              </View>
            </View>

            <View style={styles.actionsList}>
              {quickActions.map((action) => {
                const actionTone = action.icon === "calendar-month-outline" ? styles.blueActionIcon : action.icon === "shield-check-outline" ? styles.greenActionIcon : styles.amberActionIcon;
                const actionColor = action.icon === "calendar-month-outline" ? theme.brandBlue : action.icon === "shield-check-outline" ? theme.brandGreen : theme.brandAmber;

                return (
                  <Pressable key={action.title} style={styles.actionCard} onPress={action.onPress}>
                    <View style={[styles.actionIcon, actionTone]}>
                      <DashboardIconView icon={action.icon} color={actionColor} />
                    </View>
                    <View style={styles.actionCopy}>
                      <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>{action.title}</Text>
                      <Text style={[styles.actionDescription, { color: theme.textMuted }]}>{action.description}</Text>
                    </View>
                    <Text style={[styles.actionChevron, { color: actionColor }]}>→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.02,
  },
  hero: {
    gap: 4,
    paddingHorizontal: 4,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  heroLead: {
    fontSize: 15,
    lineHeight: 22,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "47.5%",
    minHeight: 104,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCopy: {
    gap: 4,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 32,
  },
  summaryLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  summaryAction: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  summaryArrow: {
    fontWeight: "700",
  },
  contentGrid: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statusCard: {},
  actionsCard: {},
  cardHead: {
    marginBottom: 16,
  },
  cardKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 20,
  },
  statusList: {
    gap: 10,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "600",
  },
  openPill: {
    backgroundColor: "#FEF1E8",
    color: "#D48806",
  },
  readyPill: {
    backgroundColor: "#E6F7EE",
    color: "#1F9D57",
  },
  shippedPill: {
    backgroundColor: "#E9F1FF",
    color: "#2F6FED",
  },
  verificationPill: {
    backgroundColor: "#EEF6FF",
    color: "#2563EB",
  },
  progressBlock: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    gap: 8,
  },
  progressHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  progressLabel: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 14,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  blueActionIcon: {
    backgroundColor: "#E9F1FF",
  },
  greenActionIcon: {
    backgroundColor: "#E6F7EE",
  },
  amberActionIcon: {
    backgroundColor: "#FFF3DD",
  },
  actionCopy: {
    flex: 1,
    gap: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionChevron: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flexShrink: 0,
  },
});
