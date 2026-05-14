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

// Wrapper components defined outside render to avoid recreation on every render
function AlumniRegisterWrapper(props: any) {
  return (
    <AlumniRegisterScreen
      onBack={() => props.navigation.goBack()}
      onSuccess={() => props.navigation.navigate('Login')}
    />
  );
}

function CreateAccountScreen(props: any) {
  return <CreateAccount {...props} />;
}

function PersonalProfileScreen(props: any) {
  return <PersonalProfile {...props} />;
}

function ParentInformationScreen(props: any) {
  return <ParentInformation {...props} />;
}

function AcademicBackgroundScreen(props: any) {
  return <AcademicBackground {...props} />;
}

function AlumniRelativeInformationScreen(props: any) {
  return <AlumniRelativeInformation {...props} />;
}

function ProgramSelectionScreen(props: any) {
  return <ProgramSelection {...props} />;
}

function DocumentUploadScreen(props: any) {
  return <DocumentUpload {...props} />;
}

function ApplicationConfirmationScreen(props: any) {
  return <ApplicationConfirmation {...props} />;
}

function SchoolLevelSelectionScreen(props: any) {
  return <SchoolLevelSelection {...props} />;
}

function ApplicantTypeSelectionScreen(props: any) {
  return <ApplicantTypeSelection {...props} />;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AlumniRegister" component={AlumniRegisterWrapper} />
      <Stack.Screen name="AdmissionsFlow" component={AdmissionsFlow} />
      <Stack.Screen name="AdmissionsHome" component={AdmissionsHome} />
      <Stack.Screen name="AdmissionsWebView" component={AdmissionsWebView} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="PersonalProfile" component={PersonalProfileScreen} />
      <Stack.Screen name="ParentInformation" component={ParentInformationScreen} />
      <Stack.Screen name="AcademicBackground" component={AcademicBackgroundScreen} />
      <Stack.Screen name="AlumniRelativeInformation" component={AlumniRelativeInformationScreen} />
      <Stack.Screen name="ProgramSelection" component={ProgramSelectionScreen} />
      <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
      <Stack.Screen name="ApplicationConfirmation" component={ApplicationConfirmationScreen} />
      <Stack.Screen name="ApplicationTracking" component={ApplicationTracking} />
      <Stack.Screen name="SchoolLevelSelection" component={SchoolLevelSelectionScreen} />
      <Stack.Screen name="ApplicantTypeSelection" component={ApplicantTypeSelectionScreen} />
    </Stack.Navigator>
  );
}
