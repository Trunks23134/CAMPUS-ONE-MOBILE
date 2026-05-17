import React, { type ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppTheme } from "./theme";

type FooterIconName = NonNullable<ComponentProps<typeof MaterialCommunityIcons>["name"]>;

type FooterItem = {
  title: string;
  icon: FooterIconName;
  text: string;
  underline?: boolean;
};

const items: FooterItem[] = [
  {
    title: "Address",
    icon: "map-marker",
    text: "3F Alumni Relations Center,\nOne Building,\nCampus One, Manila 1015",
  },
  {
    title: "Phone Number",
    icon: "phone",
    text: "(+63) 945 111 0101 | (+63) 945 010 1111",
  },
  {
    title: "E-mail Address",
    icon: "email",
    text: "alumnirelations@campusone.edu.ph",
    underline: true,
  },
  {
    title: "Office Hours",
    icon: "clock-outline",
    text: "Monday to Friday: 9:00 AM to 6:00 PM",
  },
];

export default function Footer({ theme }: { theme: AppTheme }): React.JSX.Element {
  return (
    <View style={[styles.footerContainer, { backgroundColor: theme.footerBackground }]}>
      {items.map((item) => (
        <View key={item.title} style={styles.footerBlock}>
          <Text style={[styles.footerTitle, { color: theme.footerHeading }]}>{item.title}</Text>
          <View style={styles.footerRow}>
            <MaterialCommunityIcons name={item.icon} size={16} color={theme.footerText} style={styles.footerIcon} />
            <Text style={[styles.footerText, { color: theme.footerText }, item.underline ? styles.footerUnderline : null]}>{item.text}</Text>
          </View>
        </View>
      ))}
      <View style={[styles.footerDivider, { borderTopColor: theme.divider }]}>
        <Text style={[styles.footerCopyright, { color: theme.footerMuted }]}>Copyright 2026{"\n"}Campus One. Office of Alumni Relations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#111827",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  footerBlock: {
    marginBottom: 22,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.02,
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  footerIcon: {
    marginTop: 2,
    width: 18,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  footerUnderline: {
    textDecorationLine: "underline",
  },
  footerDivider: {
    borderTopWidth: 1,
    paddingTop: 18,
    alignItems: "center",
  },
  footerCopyright: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
