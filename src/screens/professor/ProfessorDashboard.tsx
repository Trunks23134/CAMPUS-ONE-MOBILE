import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { logout, getCurrentUser, AuthUser } from '../../services/auth.service';

interface ProfessorDashboardProps {
  navigation: any;
  onLogout: () => void;
}

export default function ProfessorDashboard({ navigation, onLogout }: ProfessorDashboardProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadStats();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const loadStats = () => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({ totalClasses: 3, totalStudents: 45, pendingSubmissions: 12 });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleViewClasses = () => {
    setMenuOpen(false);
    navigation.navigate('ProfessorClassList');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name={menuOpen ? "close" : "menu"} size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleOrange}>CAMPUS</Text>
          <Text style={styles.headerTitleWhite}>Faculty</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.sideMenu}>
            <TouchableOpacity style={styles.menuItemActive} onPress={() => setMenuOpen(false)}>
              <Ionicons name="book-outline" size={20} color="#fff" />
              <Text style={styles.menuItemTextActive}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleViewClasses}>
              <Ionicons name="people-outline" size={20} color="#374151" />
              <Text style={styles.menuItemText}>My Classes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, Professor!</Text>
          <Text style={styles.welcomeEmail}>{user?.name || user?.email}</Text>
        </View>

        {/* Stats Cards */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="book-outline" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="clipboard-outline" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.pendingSubmissions}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewClasses}>
            <View style={styles.actionIcon}>
              <Ionicons name="book-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View My Classes</Text>
              <Text style={styles.actionSubtitle}>Manage your assigned subjects</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="clipboard-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Encode Grades</Text>
              <Text style={styles.actionSubtitle}>Input student grades</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Post Announcement</Text>
              <Text style={styles.actionSubtitle}>Notify your students</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Professor Module</Text>
          <Text style={styles.infoText}>
            Manage your classes, students, grades, and announcements all in one place.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    width: 256,
    backgroundColor: '#fff',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    marginTop: 56,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  menuItemTextActive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoBox: {
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#581c87',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#7c3aed',
    lineHeight: 18,
  },
});
