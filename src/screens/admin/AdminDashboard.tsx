import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { logout, getCurrentUser, AuthUser } from '../../services/auth.service';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitleOrange}>CAMPUS</Text>
            <Text style={styles.headerTitleWhite}>Admin</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitleOrange}>CAMPUS</Text>
          <Text style={styles.headerTitleWhite}>Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Admin Portal</Text>
          <Text style={styles.pageSubtitle}>System Administrator</Text>
        </View>

        {/* Web-Only Notice Card */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIconContainer}>
            <Ionicons name="desktop-outline" size={64} color="#F59E0B" />
          </View>
          <Text style={styles.noticeTitle}>Web-Only Feature</Text>
          <Text style={styles.noticeText}>
            The Admin Portal is designed for desktop use and is only available on the web version of CAMPUS Portal.
          </Text>
          <Text style={styles.noticeSubtext}>
            Please access the admin panel from a desktop browser for the full experience.
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Admin Module</Text>
          <Text style={styles.infoText}>
            Manage applications, students, and system settings. This module requires a larger screen and is optimized for desktop browsers.
          </Text>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            For administrative tasks, please use a desktop computer to access the full admin panel at the web version of CAMPUS Portal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerTitleOrange: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerTitleWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  pageHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  noticeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noticeIconContainer: {
    marginBottom: 24,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  noticeSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#78350f',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
  helpSection: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
