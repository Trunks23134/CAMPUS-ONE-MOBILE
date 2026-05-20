import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/colors';

import AuthStack from './AuthStack';
import StudentDrawer from './StudentDrawer';
import ProfessorDashboard from '../screens/professor/ProfessorDashboard';
import ProfessorClassList from '../screens/professor/ProfessorClassList';
import ProfessorClassDetail from '../screens/professor/ProfessorClassDetail';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AlumniAdminScreen from '../screens/admin/AlumniAdminScreen';
import SuperAdminScreen from '../screens/admin/SuperAdminScreen';
import AlumniDashboard from '../screens/alumni/AlumniDashboard';

export type RootStackParamList = {
  Auth: undefined;
  Student: undefined;
  Professor: undefined;
  ProfessorClassList: undefined;
  ProfessorClassDetail: { classId: string };
  Admin: undefined;
  AlumniAdmin: undefined;
  SuperAdmin: undefined;
  Alumni: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, userRole, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Not logged in — show auth flow
  if (!session || !userRole) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  // Logged in — show role-specific screen
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === 'student' && (
        <Stack.Screen name="Student" component={StudentDrawer} />
      )}
      {userRole === 'professor' && (
        <>
          <Stack.Screen name="Professor" component={(props: any) => (
            <ProfessorDashboard {...props} onLogout={() => require('../lib/supabase').supabase.auth.signOut()} />
          )} />
          <Stack.Screen name="ProfessorClassList" component={ProfessorClassList} />
          <Stack.Screen name="ProfessorClassDetail" component={ProfessorClassDetail} />
        </>
      )}
      {userRole === 'admin' && (
        <Stack.Screen name="Admin" component={(props: any) => (
          <AdminDashboard {...props} onLogout={() => require('../lib/supabase').supabase.auth.signOut()} />
        )} />
      )}
      {(userRole as string) === 'alumni_admin' && (
        <Stack.Screen name="AlumniAdmin" component={(props: any) => (
          <AlumniAdminScreen {...props} onLogout={() => require('../lib/supabase').supabase.auth.signOut()} />
        )} />
      )}
      {(userRole as string) === 'super_admin' && (
        <Stack.Screen name="SuperAdmin" component={(props: any) => (
          <SuperAdminScreen {...props} onLogout={() => require('../lib/supabase').supabase.auth.signOut()} />
        )} />
      )}
      {(userRole === 'alumni' || userRole === 'applicant') && (
        <Stack.Screen name="Alumni" component={(props: any) => (
          <AlumniDashboard {...props} onLogout={() => require('../lib/supabase').supabase.auth.signOut()} />
        )} />
      )}
      {/* Fallback — show auth if role is unrecognized */}
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
}
