export type AppTheme = {
  pageBackground: string;
  phoneFrameBackground: string;
  topBarBackground: string;
  topBarAccent: string;
  topBarText: string;
  sectionBackground: string;
  sectionCardBackground: string;
  sectionCardSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBackground: string;
  inputBorder: string;
  divider: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabInactive: string;
  footerBackground: string;
  footerHeading: string;
  footerText: string;
  footerMuted: string;
  brandBlue: string;
  brandGreen: string;
  brandAmber: string;
  brandViolet: string;
  cardBorder: string;
  cardShadow: string;
};

const sharedTheme: AppTheme = {
  pageBackground: "#E9EEF5",
  phoneFrameBackground: "#F8FAFC",
  topBarBackground: "#000000",
  topBarAccent: "#F4A51F",
  topBarText: "#FFFFFF",
  sectionBackground: "#F3F6FA",
  sectionCardBackground: "#FFFFFF",
  sectionCardSecondary: "#121726",
  textPrimary: "#111827",
  textSecondary: "#64748B",
  textMuted: "#8A94A6",
  inputBackground: "#FFFFFF",
  inputBorder: "#E2E8F0",
  divider: "#E7EBF2",
  tabBarBackground: "#111827",
  tabBarBorder: "#1D2436",
  tabInactive: "#9AA6B8",
  footerBackground: "#111827",
  footerHeading: "#F4A51F",
  footerText: "#D7DEEA",
  footerMuted: "#9AA6B8",
  brandBlue: "#2F6FED",
  brandGreen: "#1F9D57",
  brandAmber: "#D48806",
  brandViolet: "#7B5CE5",
  cardBorder: "#E7EBF2",
  cardShadow: "rgba(15, 23, 42, 0.06)",
};

export const lightTheme: AppTheme = {
  ...sharedTheme,
};

export const darkTheme: AppTheme = {
  pageBackground: "#0B0F15",
  phoneFrameBackground: "#11161F",
  topBarBackground: "#000000",
  topBarAccent: "#F4A51F",
  topBarText: "#FFFFFF",
  sectionBackground: "#161C27",
  sectionCardBackground: "#1D2430",
  sectionCardSecondary: "#11161F",
  textPrimary: "#F8FAFC",
  textSecondary: "#C0C8D4",
  textMuted: "#8D98A9",
  inputBackground: "#11161F",
  inputBorder: "#2A3442",
  divider: "#2A3442",
  tabBarBackground: "#05070A",
  tabBarBorder: "#1B2230",
  tabInactive: "#8893A5",
  footerBackground: "#05070A",
  footerHeading: "#F4A51F",
  footerText: "#C0C8D4",
  footerMuted: "#7B8597",
  brandBlue: "#4C8DFF",
  brandGreen: "#31B36E",
  brandAmber: "#F0A61A",
  brandViolet: "#9C7BFF",
  cardBorder: "#2A3442",
  cardShadow: "rgba(0, 0, 0, 0.28)",
};
