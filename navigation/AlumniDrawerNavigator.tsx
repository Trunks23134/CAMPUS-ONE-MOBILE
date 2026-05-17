import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  type DrawerContentComponentProps,
  type DrawerScreenProps,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DashboardHome from "../DashboardHome";
import CardApplicationPage from "../CardApplicationPage";
import DocumentRequestPage from "../DocumentRequestPage";
import ClearanceTrackerPage from "../ClearanceTrackerPage";
import ProfilePage from "../ProfilePage";
import MyRequestsPage from "../MyRequestsPage";
import BillingPaymentsPage from "../BillingPaymentsPage";
import { AppTheme } from "../theme";
import type { HeaderIconName } from "../PortalHeader";

type RootDrawerParamList = {
  Home: undefined;
  MyRequests: undefined;
  BillingPayments: undefined;
  CardApplication: undefined;
  DocumentRequest: undefined;
  ClearanceTracker: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

type AlumniDrawerNavigatorProps = {
  theme: AppTheme;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onSignOut: () => void;
  userDisplayName?: string;
  userEmail?: string;
  userFullName?: string;
};

type DrawerRouteName = keyof RootDrawerParamList;

type DrawerItem = {
  name?: DrawerRouteName;
  label: string;
  icon: HeaderIconName;
};

const drawerItems: DrawerItem[] = [
  { name: "Home", label: "Dashboard", icon: "view-dashboard-outline" },
  { name: "MyRequests", label: "My Requests", icon: "view-list-outline" },
  { name: "BillingPayments", label: "Billing & Payments", icon: "credit-card-outline" },
  { name: "DocumentRequest", label: "Document Request", icon: "file-document-outline" },
  { name: "CardApplication", label: "Card Application", icon: "card-account-details-outline" },
  { name: "ClearanceTracker", label: "Clearance Tracker", icon: "vector-polyline" },
];

function getInitials(name?: string): string {
  if (!name) {
    return "N";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "N";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function formatDisplayName(name?: string): string {
  if (!name) {
    return "John M Doe...";
  }

  return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}

function AlumniDrawerContent({
  state,
  navigation,
  theme,
  onSignOut,
  userDisplayName,
}: DrawerContentComponentProps & {
  theme: AppTheme;
  onSignOut: () => void;
  userDisplayName?: string;
}): React.JSX.Element {
  const activeRoute = state.routeNames[state.index] ?? "Home";
  const initials = getInitials(userDisplayName);

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerScroll} scrollEnabled={false}>
      <View style={[styles.drawerShell, { backgroundColor: theme.topBarBackground }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerBrand}>
            <Text style={[styles.drawerBrandAccent, { color: theme.topBarAccent }]}>CAMPUS </Text>
            <Text style={[styles.drawerBrandText, { color: theme.topBarText }]}>Portal</Text>
          </Text>
        </View>

        <View style={styles.drawerDivider} />

        <View style={styles.drawerNav}>
          {drawerItems.map((item) => {
            const active = item.name ? activeRoute === item.name : false;

            return (
              <Pressable
                key={item.label}
                style={[styles.drawerItem, active ? styles.drawerItemActive : null]}
                onPress={item.name ? () => navigation.navigate(item.name) : undefined}
                disabled={!item.name}
              >
                <MaterialCommunityIcons name={item.icon} size={17} color={active ? "#F5F7FA" : "#AEB8C9"} />
                <Text style={[styles.drawerLabel, active ? styles.drawerLabelActive : null]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.drawerFooter}>
          <Pressable style={styles.drawerFooterAction} onPress={() => navigation.navigate("Profile") as never}>
            <MaterialCommunityIcons name="cog-outline" size={18} color="#D7DEEA" />
            <Text style={styles.drawerFooterLabel}>Settings</Text>
          </Pressable>

          <Pressable style={styles.drawerFooterAction} onPress={onSignOut}>
            <MaterialCommunityIcons name="logout-variant" size={18} color="#D96B63" />
            <Text style={styles.drawerDangerLabel}>Log Out</Text>
          </Pressable>

          <Pressable style={styles.drawerProfileCard} onPress={() => navigation.navigate("Profile") as never}>
            <View style={styles.drawerAvatar}>
              <Text style={styles.drawerAvatarText}>{initials}</Text>
            </View>

            <View style={styles.drawerProfileCopy}>
              <Text style={styles.drawerProfileTitle}>{formatDisplayName(userDisplayName)}</Text>
              <Text style={styles.drawerProfileSub}>Student</Text>
            </View>

            <MaterialCommunityIcons name="chevron-down" size={18} color="#AEB8C9" />
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function AlumniDrawerNavigator({
  theme,
  isDarkMode,
  onToggleDarkMode,
  onSignOut,
  userDisplayName,
  userEmail,
  userFullName,
}: AlumniDrawerNavigatorProps): React.JSX.Element {
  function HomeScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "Home">): React.JSX.Element {
    return (
      <DashboardHome
        theme={theme}
        onOpenMenu={() => navigation.openDrawer()}
        onOpenCardApplication={() => navigation.navigate("CardApplication")}
        onOpenDocuments={() => navigation.navigate("DocumentRequest")}
        onOpenClearance={() => navigation.navigate("ClearanceTracker")}
        userDisplayName={userDisplayName}
      />
    );
  }

  function CardApplicationScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "CardApplication">): React.JSX.Element {
    return <CardApplicationPage theme={theme} onBack={() => navigation.navigate("Home")} userFullName={userFullName} userEmail={userEmail} />;
  }

  function MyRequestsScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "MyRequests">): React.JSX.Element {
    return <MyRequestsPage theme={theme} onOpenMenu={() => navigation.openDrawer()} />;
  }

  function BillingPaymentsScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "BillingPayments">): React.JSX.Element {
    return <BillingPaymentsPage theme={theme} onOpenMenu={() => navigation.openDrawer()} />;
  }

  function DocumentRequestScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "DocumentRequest">): React.JSX.Element {
    return <DocumentRequestPage theme={theme} onBack={() => navigation.navigate("Home")} />;
  }

  function ClearanceTrackerScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "ClearanceTracker">): React.JSX.Element {
    return <ClearanceTrackerPage theme={theme} onBack={() => navigation.navigate("Home")} />;
  }

  function ProfileScreen({ navigation }: DrawerScreenProps<RootDrawerParamList, "Profile">): React.JSX.Element {
    return (
      <ProfilePage
        theme={theme}
        onBack={() => navigation.navigate("Home")}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onSignOut={onSignOut}
        userFullName={userFullName}
        userEmail={userEmail}
      />
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        sceneContainerStyle={{
          backgroundColor: theme.pageBackground,
        }}
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          overlayColor: "rgba(15, 23, 42, 0.48)",
          drawerStyle: {
            width: 248,
            backgroundColor: theme.topBarBackground,
          },
        }}
        drawerContent={(props) => (
          <AlumniDrawerContent {...props} theme={theme} onSignOut={onSignOut} userDisplayName={userDisplayName} />
        )}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="MyRequests" component={MyRequestsScreen} />
        <Drawer.Screen name="BillingPayments" component={BillingPaymentsScreen} />
        <Drawer.Screen name="CardApplication" component={CardApplicationScreen} />
        <Drawer.Screen name="DocumentRequest" component={DocumentRequestScreen} />
        <Drawer.Screen name="ClearanceTracker" component={ClearanceTrackerScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    flexGrow: 1,
  },
  drawerShell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
  },
  drawerHeader: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  drawerBrand: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  drawerBrandAccent: {
    fontSize: 18,
    fontWeight: "900",
  },
  drawerBrandText: {
    fontSize: 18,
    fontWeight: "700",
  },
  drawerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 4,
    marginBottom: 10,
  },
  drawerNav: {
    gap: 8,
  },
  drawerItem: {
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerItemActive: {
    backgroundColor: "#2A3142",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  drawerLabel: {
    color: "#D7DEEA",
    fontSize: 14,
    fontWeight: "700",
  },
  drawerLabelActive: {
    color: "#F8FAFC",
  },
  drawerFooter: {
    marginTop: "auto",
    gap: 8,
    paddingTop: 28,
  },
  drawerFooterAction: {
    minHeight: 42,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerFooterLabel: {
    color: "#D7DEEA",
    fontSize: 14,
    fontWeight: "700",
  },
  drawerDangerLabel: {
    color: "#D96B63",
    fontSize: 14,
    fontWeight: "700",
  },
  drawerProfileCard: {
    marginTop: 12,
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#161C29",
    borderWidth: 1,
    borderColor: "rgba(244,165,31,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerAvatarText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  drawerProfileCopy: {
    flex: 1,
  },
  drawerProfileTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "800",
  },
  drawerProfileSub: {
    color: "#97A3B6",
    fontSize: 11,
    marginTop: 2,
  },
});
