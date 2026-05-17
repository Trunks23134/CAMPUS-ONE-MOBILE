import React, { type ComponentProps, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppTheme } from "./theme";

export type HeaderIconName = NonNullable<ComponentProps<typeof MaterialCommunityIcons>["name"]>;

type HeaderAction = {
  icon: HeaderIconName;
  onPress?: () => void;
  accessibilityLabel?: string;
  badge?: boolean;
};

type PortalHeaderProps = {
  theme: AppTheme;
  leftAction?: HeaderAction;
  rightActions?: HeaderAction[];
  children: ReactNode;
};

function HeaderActionButton({ action, theme }: { action: HeaderAction; theme: AppTheme }): React.JSX.Element {
  return (
    <Pressable
      hitSlop={8}
      accessibilityLabel={action.accessibilityLabel}
      onPress={action.onPress}
      style={({ pressed }) => [styles.actionButton, pressed ? styles.actionButtonPressed : null]}
    >
      <MaterialCommunityIcons name={action.icon} size={22} color={theme.topBarText} />
      {action.badge ? <View style={[styles.badge, { backgroundColor: theme.topBarAccent }]} /> : null}
    </Pressable>
  );
}

export default function PortalHeader({ theme, leftAction, rightActions = [], children }: PortalHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.header, { backgroundColor: theme.topBarBackground, borderBottomColor: theme.tabBarBorder }]}>
      <View style={styles.sideSlot}>
        {leftAction ? <HeaderActionButton action={leftAction} theme={theme} /> : null}
      </View>

      <View style={styles.centerSlot}>{children}</View>

      <View style={[styles.sideSlot, styles.rightSlot]}>
        {rightActions.map((action, index) => (
          <View key={`${action.icon}-${index}`} style={index > 0 ? styles.actionGap : undefined}>
            <HeaderActionButton action={action} theme={theme} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 76,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sideSlot: {
    width: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightSlot: {
    alignItems: "flex-end",
  },
  centerSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  badge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionGap: {
    marginLeft: 10,
  },
});