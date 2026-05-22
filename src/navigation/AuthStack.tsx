import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AlumniRegisterScreen from '../screens/alumni/AlumniRegisterScreen';

// Admissions flow
import AdmissionsFlow from '../screens/admissions/AdmissionsFlow';
import CreateAccount from '../screens/admissions/CreateAccount';
import PersonalProfile from '../screens/admissions/PersonalProfile';
import ParentInformation from '../screens/admissions/ParentInformation';
import AcademicBackground from '../screens/admissions/AcademicBackground';
import AlumniRelativeInformation from '../screens/admissions/AlumniRelativeInformation';
import ProgramSelection from '../screens/admissions/ProgramSelection';
import DocumentUpload from '../screens/admissions/DocumentUpload';
import ApplicationConfirmation from '../screens/admissions/ApplicationConfirmation';
import ApplicationTracking from '../screens/admissions/ApplicationTracking';
import SchoolLevelSelection from '../screens/admissions/SchoolLevelSelection';
import ApplicantTypeSelection from '../screens/admissions/ApplicantTypeSelection';
import AdmissionsHome from '../screens/admissions/AdmissionsHome';
import AdmissionsWebView from '../screens/admissions/AdmissionsWebView';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  AlumniRegister: undefined;
  AdmissionsFlow: undefined;
  AdmissionsHome: undefined;
  AdmissionsWebView: undefined;
  CreateAccount: any;
  PersonalProfile: any;
  ParentInformation: any;
  AcademicBackground: any;
  AlumniRelativeInformation: any;
  ProgramSelection: any;
  DocumentUpload: any;
  ApplicationConfirmation: any;
  ApplicationTracking: undefined;
  SchoolLevelSelection: any;
  ApplicantTypeSelection: any;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AlumniRegister">
        {(props: any) => (
          <AlumniRegisterScreen
            onBack={() => props.navigation.goBack()}
            onSuccess={() => props.navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AdmissionsFlow" component={AdmissionsFlow} />
      <Stack.Screen name="AdmissionsHome" component={AdmissionsHome} />
      <Stack.Screen name="AdmissionsWebView" component={AdmissionsWebView} />
      <Stack.Screen name="CreateAccount">{(props: any) => <CreateAccount {...props} />}</Stack.Screen>
      <Stack.Screen name="PersonalProfile">{(props: any) => <PersonalProfile {...props} />}</Stack.Screen>
      <Stack.Screen name="ParentInformation">{(props: any) => <ParentInformation {...props} />}</Stack.Screen>
      <Stack.Screen name="AcademicBackground">{(props: any) => <AcademicBackground {...props} />}</Stack.Screen>
      <Stack.Screen name="AlumniRelativeInformation">{(props: any) => <AlumniRelativeInformation {...props} />}</Stack.Screen>
      <Stack.Screen name="ProgramSelection">{(props: any) => <ProgramSelection {...props} />}</Stack.Screen>
      <Stack.Screen name="DocumentUpload">{(props: any) => <DocumentUpload {...props} />}</Stack.Screen>
      <Stack.Screen name="ApplicationConfirmation">{(props: any) => <ApplicationConfirmation {...props} />}</Stack.Screen>
      <Stack.Screen name="ApplicationTracking" component={ApplicationTracking} />
      <Stack.Screen name="SchoolLevelSelection">{(props: any) => <SchoolLevelSelection {...props} />}</Stack.Screen>
      <Stack.Screen name="ApplicantTypeSelection">{(props: any) => <ApplicantTypeSelection {...props} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
