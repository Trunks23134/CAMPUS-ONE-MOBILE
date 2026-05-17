import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type ClearanceTrackerPageProps = {
  theme: AppTheme;
  onBack: () => void;
};

type SignoffStatus = "pending" | "in-review" | "signed";

type Department = {
  id: "library" | "finance" | "dean" | "labs";
  name: string;
  approver: string;
  status: SignoffStatus;
  updatedAt: string;
};

const initialDepartments: Department[] = [
  { id: "library", name: "Library", approver: "Ms. Ramos", status: "signed", updatedAt: "9:12 AM" },
  { id: "finance", name: "Finance", approver: "Mr. Lim", status: "in-review", updatedAt: "9:45 AM" },
  { id: "dean", name: "Dean", approver: "Dr. Santos", status: "pending", updatedAt: "Awaiting queue" },
  { id: "labs", name: "Labs", approver: "Engr. Cruz", status: "pending", updatedAt: "Awaiting queue" },
];

const statusOrder: SignoffStatus[] = ["pending", "in-review", "signed"];

function statusMeta(status: SignoffStatus): { label: string; color: string; icon: string } {
  if (status === "signed") {
    return { label: "Signed Off", color: "#43A047", icon: "check-decagram" };
  }

  if (status === "in-review") {
    return { label: "In Review", color: "#1E88E5", icon: "progress-clock" };
  }

  return { label: "Pending", color: "#8D99AE", icon: "clock-outline" };
}

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ClearanceTrackerPage({ theme, onBack }: ClearanceTrackerPageProps): React.JSX.Element {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  useEffect(() => {
    const timer = setInterval(() => {
      setDepartments((prev) => {
        const nextTarget = prev.find((item) => item.status !== "signed");

        if (!nextTarget) {
          return prev;
        }

        return prev.map((item) => {
          if (item.id !== nextTarget.id) {
            return item;
          }

          const statusIndex = statusOrder.indexOf(item.status);
          const nextStatus: SignoffStatus = statusOrder[Math.min(statusIndex + 1, statusOrder.length - 1)] ?? "signed";
          return {
            ...item,
            status: nextStatus,
            updatedAt: nowLabel(),
          };
        });
      });
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const signedCount = useMemo(() => departments.filter((item) => item.status === "signed").length, [departments]);
  const progress = Math.round((signedCount / departments.length) * 100);

  return (
    <>
      <PortalHeader
        theme={theme}
        leftAction={{ icon: "arrow-left", onPress: onBack, accessibilityLabel: "Go back" }}
      >
        <Text style={[styles.topTitle, { color: theme.topBarText }]}>Clearance Tracker</Text>
      </PortalHeader>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.sectionBackground }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Clearance Routing Progress</Text>
          <Text style={styles.progressSub}>{signedCount}/{departments.length} units signed off</Text>

          <View style={styles.stepper}>
            <View style={styles.stepperLine} />
            <View style={styles.stepperSteps}>
              {departments.map((d, i) => {
                const meta = statusMeta(d.status);
                const isCompleted = d.status === "signed";
                const isInProgress = d.status === "in-review";

                return (
                  <View key={d.id} style={styles.step}>
                    <View style={[styles.stepCircle, isCompleted ? { backgroundColor: meta.color } : null, isInProgress ? { borderColor: meta.color, borderWidth: 2 } : null]}>
                      <MaterialCommunityIcons
                        name={(isCompleted ? "check" : isInProgress ? "progress-clock" : "clock-outline") as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                        size={16}
                        color={isCompleted ? "#fff" : meta.color}
                      />
                    </View>
                    <Text style={styles.stepLabel}>{d.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressPercent}>{progress}% Complete</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}> 
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Department Sign-off Status</Text>

          {departments.map((department, index) => {
            const meta = statusMeta(department.status);
            return (
              <View
                key={department.id}
                style={[
                  styles.departmentRow,
                  index < departments.length - 1 ? { borderBottomColor: theme.divider, borderBottomWidth: StyleSheet.hairlineWidth } : null,
                ]}
              >
                <View style={styles.departmentLeft}>
                  <View style={[styles.departmentIcon, { backgroundColor: `${meta.color}22` }]}> 
                    <MaterialCommunityIcons name={meta.icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]} size={20} color={meta.color} />
                  </View>
                  <View>
                    <Text style={[styles.departmentName, { color: theme.textPrimary }]}>{department.name}</Text>
                    <Text style={[styles.departmentSub, { color: theme.textSecondary }]}>Approver: {department.approver}</Text>
                    <Text style={[styles.departmentSub, { color: theme.textMuted }]}>Updated: {department.updatedAt}</Text>
                  </View>
                </View>

                <View style={[styles.statusPill, { backgroundColor: `${meta.color}20`, borderColor: `${meta.color}66` }]}> 
                  <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  topTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
  },
  liveBadge: {
    minWidth: 62,
    borderRadius: 999,
    backgroundColor: "#111111",
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F44336",
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressCard: {
    backgroundColor: "#F5B400",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  progressSub: {
    color: "#111111",
    fontSize: 13,
    marginBottom: 14,
  },
  stepper: {
    marginTop: 4,
    paddingVertical: 8,
    position: "relative",
  },
  stepperLine: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 28,
    height: 4,
    backgroundColor: "rgba(17,17,17,0.12)",
    borderRadius: 2,
  },
  stepperSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  step: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(17,17,17,0.12)",
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#111111",
    fontWeight: "700",
    textAlign: "center",
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(17,17,17,0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#111111",
    borderRadius: 999,
  },
  progressFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  progressPercent: {
    color: "#111111",
    fontWeight: "800",
  },
  progressSync: {
    color: "#333333",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: 22,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  departmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
  },
  departmentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  departmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  departmentName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  departmentSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
