import React from "react";
import { View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StudentDrawerContent from "./StudentDrawerContent";
import { StudentDrawerParamList } from "../types/navigation";
import { CartProvider } from "../context/CartContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import { NotificationPanelProvider } from "../context/NotificationPanelContext";
import NotificationPanel from "../components/NotificationPanel";

// Core screens
import DashboardScreen from "../screens/student/dashboard/DashboardScreen";
import ProfileScreen from "../screens/student/profile/ProfileScreen";
import CourseDetailsScreen from "../screens/student/general/CourseDetailsScreen";
import EvaluationScreen from "../screens/student/general/EvaluationScreen";

// Enrollment screens
import OnlineEnrollmentScreen from "../screens/student/enrollment/OnlineEnrollmentScreen";
import RegularPathEnrollmentScreen from "../screens/student/enrollment/RegularPathEnrollmentScreen";
import IrregularPathEnrollmentScreen from "../screens/student/enrollment/IrregularPathEnrollmentScreen";
import BalancePaymentScreen from "../screens/student/enrollment/BalancePaymentScreen";
import AdvisedCoursesScreen from "../screens/student/enrollment/AdvisedCoursesScreen";
import AddDropCoursesScreen from "../screens/student/enrollment/AddDropCoursesScreen";
import DeficienciesScreen from "../screens/student/enrollment/DeficienciesScreen";

// Subject flow + My courses + Notifications
import EnrollmentSearchScreen from "../screens/student/dashboard/EnrollmentSearchScreen";
import EnrollmentCartScreen from "../screens/student/dashboard/EnrollmentCartScreen";
import BrowseSubjectsScreen from "../screens/student/dashboard/BrowseSubjectsScreen";
import MyCoursesScreen from "../screens/student/dashboard/MyCoursesScreen";
import NotificationsScreen from "../screens/student/dashboard/NotificationsScreen";

// Semestral grades
import ViewSemestralGradesScreen from "../screens/student/dashboard/ViewSemestralGradesScreen";

// Other screens
import GraduationScreen from "../screens/student/general/GraduationScreen";
import HelpScreen from "../screens/student/general/HelpScreen";
import SettingsScreen from "../screens/student/general/SettingsScreen";
import LogoutScreen from "../screens/student/general/LogoutScreen";

const Drawer = createDrawerNavigator<StudentDrawerParamList>();

export default function StudentDrawer() {
  return (
    <NotificationsProvider>
      <NotificationPanelProvider>
        <CartProvider>
          <View style={{ flex: 1 }}>
            <Drawer.Navigator
              drawerContent={(props) => <StudentDrawerContent {...props} />}
              screenOptions={{
                headerShown: false,
                drawerType: "front",
                drawerStyle: { backgroundColor: "#0B0F14", width: 260 },
                drawerPosition: "left",
              }}
            >
              <Drawer.Screen name="Dashboard" component={DashboardScreen} />
              <Drawer.Screen name="Browse Subjects" component={BrowseSubjectsScreen} />
              <Drawer.Screen name="Enrollment Search" component={EnrollmentSearchScreen} />
              <Drawer.Screen name="Enrollment Cart" component={EnrollmentCartScreen} />
              <Drawer.Screen name="My Courses" component={MyCoursesScreen} />
              <Drawer.Screen name="Notifications" component={NotificationsScreen} />
              <Drawer.Screen name="Profile" component={ProfileScreen} />
              <Drawer.Screen name="Course Details" component={CourseDetailsScreen} />
              <Drawer.Screen name="Evaluation" component={EvaluationScreen} />
              <Drawer.Screen name="Online Enrollment" component={OnlineEnrollmentScreen} />
              <Drawer.Screen name="Regular Path Enrollment" component={RegularPathEnrollmentScreen} />
              <Drawer.Screen name="Irregular Path Enrollment" component={IrregularPathEnrollmentScreen} />
              <Drawer.Screen name="Balance Payment" component={BalancePaymentScreen} />
              <Drawer.Screen name="Advised Courses" component={AdvisedCoursesScreen} />
              <Drawer.Screen name="Add/Drop Courses" component={AddDropCoursesScreen} />
              <Drawer.Screen name="Deficiencies" component={DeficienciesScreen} />
              <Drawer.Screen name="View Semestral Grades" component={ViewSemestralGradesScreen} />
              <Drawer.Screen name="Graduation" component={GraduationScreen} />
              <Drawer.Screen name="Help" component={HelpScreen} />
              <Drawer.Screen name="Settings" component={SettingsScreen} />
              <Drawer.Screen name="Logout" component={LogoutScreen} />
            </Drawer.Navigator>

            {/* Panel renders at root level so it covers the full screen */}
            <NotificationPanel />
          </View>
        </CartProvider>
      </NotificationPanelProvider>
    </NotificationsProvider>
  );
}