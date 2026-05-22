import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CampusPortalBrand from '../../components/CampusPortalBrand';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (authError) {
      setError(authError.message || 'Invalid credentials');
    }
    // On success, AuthContext detects the session change and RootNavigator
    // automatically routes to the correct screen based on role
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name="school-outline" size={20} color="#F59E0B" />
            <CampusPortalBrand titleStyle={styles.headerText} />
          </View>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Sign In</Text>
            <Text style={styles.subheading}>Access your portal</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Who can log in here?</Text>
            <Text style={styles.infoItem}>• <Text style={styles.infoBold}>Students:</Text> Access dashboard and enrollment</Text>
            <Text style={styles.infoItem}>• <Text style={styles.infoBold}>Professors:</Text> Manage classes and grades</Text>
            <Text style={styles.infoItem}>• <Text style={styles.infoBold}>Alumni:</Text> Connect with your alma mater</Text>
            <Text style={styles.infoItem}>• <Text style={styles.infoBold}>Admin:</Text> Manage applications (web only)</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.buttonText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Need help? Contact the admissions office</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#1a1a1a', height: 56,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  headingContainer: { marginBottom: 24 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  subheading: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  infoBox: {
    backgroundColor: '#eff6ff', borderWidth: 1,
    borderColor: '#bfdbfe', borderRadius: 8, padding: 12, marginBottom: 24,
  },
  infoTitle: { fontSize: 12, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
  infoItem: { fontSize: 12, color: '#1e40af', marginBottom: 4 },
  infoBold: { fontWeight: '600' },
  errorBox: {
    backgroundColor: '#fef2f2', borderWidth: 1,
    borderColor: '#fecaca', borderRadius: 8, padding: 12, marginBottom: 16,
  },
  errorText: { fontSize: 14, color: '#b91c1c' },
  form: { marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1,
    borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 14,
  },
  button: {
    backgroundColor: '#F59E0B', borderRadius: 12, height: 48,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
  helpContainer: { alignItems: 'center', marginTop: 24 },
  helpText: { fontSize: 12, color: '#6b7280' },
});
