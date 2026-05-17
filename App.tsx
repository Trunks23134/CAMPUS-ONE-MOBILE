import "react-native-reanimated";
import "react-native-gesture-handler";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import LandingPage from "./LandingPage";
import AlumniDrawerNavigator from "./navigation/AlumniDrawerNavigator";
import { darkTheme, lightTheme } from "./theme";

type Page = "landing" | "dashboard";

export default function App(): React.JSX.Element {
  const [page, setPage] = useState<Page>("landing");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={page === "landing" ? "dark" : isDarkMode ? "light" : "dark"} />
      {page === "landing" ? (
        <LandingPage isDarkMode={false} theme={lightTheme} onContinue={() => setPage("dashboard")} />
      ) : (
        <AlumniDrawerNavigator
          theme={theme}
          isDarkMode={isDarkMode}
          onToggleDarkMode={setIsDarkMode}
          onSignOut={() => setPage("landing")}
          userDisplayName="John Doe"
          userFullName="John Doe"
          userEmail="jertznaval57@gmail.com"
        />
      )}
    </GestureHandlerRootView>
  );
}
