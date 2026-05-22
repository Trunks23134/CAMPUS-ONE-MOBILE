import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme/colors";
const colors = theme.colors;

type Props = {
  navigation: any;
};

type RowProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  badgeText?: string;
};

function Row({
  label,
  icon,
  onPress,
  active,
  rightIcon,
  danger,
  badgeText,
}: RowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.row, active && styles.rowActive]}
    >
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#FF3B30" : active ? "#FFFFFF" : "#F3F4F6"}
          style={{ width: 22 }}
        />

        <Text
          style={[
            styles.rowText,
            active && styles.rowTextActive,
            danger && styles.rowTextDanger,
          ]}
        >
          {label}
        </Text>
      </View>

      <View style={styles.rowRight}>
        {badgeText ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : null}

        {rightIcon ? (
          <Ionicons name={rightIcon} size={16} color="#FFFFFF" />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function SubRow({
  label,
  icon,
  onPress,
  active,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.subRow}
    >
      <Ionicons
        name={icon}
        size={16}
        color={active ? "#FFFFFF" : "#D1D5DB"}
        style={{ width: 20 }}
      />
      <Text style={[styles.subText, active && styles.subTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function StudentDrawerContent({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [enrollmentOpen, setEnrollmentOpen] = useState(true);

  const state = navigation.getState?.();
  const activeRouteName = useMemo(() => {
    const r = state?.routes?.[state.index];
    return r?.name;
  }, [state]);

  const go = (name: string) => navigation.navigate(name);

  return (
    <DrawerContentScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 18 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>
          <Text style={styles.brandAccent}>CAMPUS</Text>{" "}
          <Text style={styles.brandWhite}>Portal</Text>
        </Text>

        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Main nav */}
      <View style={styles.section}>
        <Row
          label="Dashboard"
          icon="grid-outline"
          onPress={() => go("Dashboard")}
          active={activeRouteName === "Dashboard"}
        />

        <Row
          label="Profile"
          icon="person-outline"
          onPress={() => go("Profile")}
          active={activeRouteName === "Profile"}
        />

        <Row
          label="Course Details"
          icon="book-outline"
          onPress={() => go("Course Details")}
          active={activeRouteName === "Course Details"}
        />

        <Row
          label="Evaluation"
          icon="clipboard-outline"
          onPress={() => go("Evaluation")}
          active={activeRouteName === "Evaluation"}
        />

        <Row
          label="Enrollment"
          icon="school-outline"
          onPress={() => setEnrollmentOpen((v) => !v)}
          active={enrollmentOpen}
          rightIcon={enrollmentOpen ? "chevron-down" : "chevron-forward"}
        />

        {enrollmentOpen ? (
          <View style={styles.subSectionWrap}>
            <View style={styles.subSectionLine} />
            <View style={styles.subSection}>
              <SubRow
                label="Online Enrollment"
                icon="document-text-outline"
                onPress={() => go("Online Enrollment")}
                active={activeRouteName === "Online Enrollment"}
              />
              <SubRow
                label="Balance Payment"
                icon="cash-outline"
                onPress={() => go("Balance Payment")}
                active={activeRouteName === "Balance Payment"}
              />
              <SubRow
                label="Advised Courses"
                icon="reader-outline"
                onPress={() => go("Advised Courses")}
                active={activeRouteName === "Advised Courses"}
              />
              <SubRow
                label="Deficiencies"
                icon="alert-circle-outline"
                onPress={() => go("Deficiencies")}
                active={activeRouteName === "Deficiencies"}
              />

            </View>
          </View>
        ) : null}

        <Row
          label="View Semestral Grades"
          icon="bar-chart-outline"
          onPress={() => go("View Semestral Grades")}
          active={activeRouteName === "View Semestral Grades"}
        />

        <Row
          label="Graduation"
          icon="school-outline"
          onPress={() => go("Graduation")}
          active={activeRouteName === "Graduation"}
        />
      </View>

      {/* Bottom */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />

        <Row
          label="Help"
          icon="help-circle-outline"
          onPress={() => go("Help")}
          active={activeRouteName === "Help"}
        />

        <Row
          label="Settings"
          icon="settings-outline"
          onPress={() => go("Settings")}
          active={activeRouteName === "Settings"}
        />

        <Row
          label="Log Out"
          icon="log-out-outline"
          onPress={() => go("Logout")}
          danger
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000000",
    paddingTop: 18,
    paddingBottom: 16,
  },

  header: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: 18,
    fontWeight: "800",
  },

  brandAccent: {
    color: colors.primary,
  },

  brandWhite: {
    color: "#FFFFFF",
  },

  divider: {
    height: 1,
    backgroundColor: "#1F2937",
    marginHorizontal: 8,
    marginBottom: 10,
  },

  section: {
    paddingHorizontal: 10,
    paddingTop: 6,
  },

  row: {
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  rowActive: {
    backgroundColor: colors.primary,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  rowText: {
    color: "#F3F4F6",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  rowTextActive: {
    color: "#FFFFFF",
  },

  rowTextDanger: {
    color: "#FF3B30",
  },

  badge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  subSectionWrap: {
    flexDirection: "row",
    marginLeft: 18,
    marginBottom: 8,
    marginTop: 2,
  },

  subSectionLine: {
    width: 1,
    backgroundColor: "#374151",
    marginRight: 12,
    borderRadius: 999,
  },

  subSection: {
    flex: 1,
    paddingVertical: 4,
  },

  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingRight: 10,
  },

  subText: {
    color: "#D1D5DB",
    fontSize: 13.5,
    fontWeight: "500",
    flexShrink: 1,
  },

  subTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  bottomSection: {
    marginTop: "auto",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
});
