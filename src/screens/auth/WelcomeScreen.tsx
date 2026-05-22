import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import CampusPortalBrand from '../../components/CampusPortalBrand';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const { session, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && session && userRole) {
      if (userRole === 'student') navigation.replace('Student');
      else if (userRole === 'professor') navigation.replace('Professor');
      else if (userRole === 'admin') navigation.replace('Admin');
      else if (userRole === 'alumni' || userRole === 'applicant') navigation.replace('Alumni');
    }
  }, [session, userRole, loading]);

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']} style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <CampusPortalBrand />
        </View>

        <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSubtitle}>Your gateway to education</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NEW TO CAMPUS?</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AdmissionsFlow')}>
              <View style={styles.buttonContent}>
                <Ionicons name="person-add-outline" size={24} color="#fff" />
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitle}>New Applicant</Text>
                  <Text style={styles.buttonSubtitle}>Start your application</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.alumniButton} onPress={() => navigation.navigate('AlumniRegister')}>
              <View style={styles.buttonContent}>
                <Ionicons name="school-outline" size={24} color="#F59E0B" />
                <View style={styles.buttonText}>
                  <Text style={styles.buttonTitleAlumni}>Alumni Sign Up</Text>
                  <Text style={styles.buttonSubtitleAlumni}>Register your alumni account</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ALREADY HAVE AN ACCOUNT?</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
            <View style={styles.buttonContent}>
              <Ionicons name="log-in-outline" size={24} color="#fff" />
              <View style={styles.buttonText}>
                <Text style={styles.buttonTitle}>Sign In</Text>
                <Text style={styles.buttonSubtitle}>Existing users</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.trackLink} onPress={() => navigation.navigate('ApplicationTracking')}>
          <Text style={styles.trackLinkText}>Track Application Status →</Text>
        </TouchableOpacity>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>Need help? Contact admissions office</Text>
        </View>
      </View>
    </SafeAreaView>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { backgroundColor: 'transparent', height: 64, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  logoImage: { width: 36, height: 36, borderRadius: 10, marginLeft: 10 },
  headerTitle: { flexDirection: 'row', alignItems: 'center' },
  headerTitleOrange: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold', letterSpacing: -0.5 },
  headerTitleWhite: { color: '#fff', fontSize: 16, fontWeight: '300', letterSpacing: -0.5 },
  content: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'transparent' },
  welcomeSection: { alignItems: 'center', marginBottom: 48 },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 16, color: '#cbd5e0' },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#7a8a99', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  actions: { gap: 16, marginBottom: 32 },
  primaryButton: {
    backgroundColor: '#F59E0B', borderRadius: 12, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  alumniButton: {
    backgroundColor: '#2d3748', borderRadius: 12, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#F59E0B',
  },
  secondaryButton: {
    backgroundColor: '#474f5bff', borderRadius: 12, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  buttonText: { flex: 1 },
  buttonTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  buttonTitleAlumni: { fontSize: 16, fontWeight: 'bold', color: '#F59E0B', marginBottom: 2 },
  buttonSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)' },
  buttonSubtitleAlumni: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)' },
  trackLink: { alignItems: 'center', paddingVertical: 16 },
  trackLinkText: { fontSize: 14, color: '#F59E0B', fontWeight: '500' },
  helpSection: { alignItems: 'center', marginTop: 32 },
  helpText: { fontSize: 12, color: '#a0aec0' },
});
