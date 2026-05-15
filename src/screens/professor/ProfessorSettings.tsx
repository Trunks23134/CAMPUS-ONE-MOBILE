import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessorSettings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This would open the profile editor screen.');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This would open the password reset flow.');
  };

  const handleTogglePreference = (type: string, value: boolean, setter: any) => {
    setter(value);
  };

  const handleSignOutEverywhere = () => {
    Alert.alert(
      'Sign Out Everywhere',
      'Are you sure you want to sign out from all devices? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Success', 'Signed out from all other devices successfully.') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account preferences</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
            <View style={styles.rowIcon}>
              <Ionicons name="person-outline" size={20} color="#4b5563" />
            </View>
            <Text style={styles.rowText}>Edit Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
            <View style={styles.rowIcon}>
              <Ionicons name="lock-closed-outline" size={20} color="#4b5563" />
            </View>
            <Text style={styles.rowText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="notifications-outline" size={20} color="#4b5563" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowText}>Push Notifications</Text>
              <Text style={styles.rowSubtext}>Receive alerts on your device</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={(val) => handleTogglePreference('Push Notifications', val, setNotifications)} 
              trackColor={{ false: '#d1d5db', true: '#F59E0B' }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="mail-outline" size={20} color="#4b5563" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowText}>Email Alerts</Text>
              <Text style={styles.rowSubtext}>Receive daily summaries</Text>
            </View>
            <Switch 
              value={emailAlerts} 
              onValueChange={(val) => handleTogglePreference('Email Alerts', val, setEmailAlerts)} 
              trackColor={{ false: '#d1d5db', true: '#F59E0B' }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={20} color="#4b5563" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowText}>Dark Mode</Text>
              <Text style={styles.rowSubtext}>Switch to dark theme</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={(val) => handleTogglePreference('Dark Mode', val, setDarkMode)} 
              trackColor={{ false: '#d1d5db', true: '#F59E0B' }}
            />
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleSignOutEverywhere}>
            <View style={[styles.rowIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.rowText, { color: '#ef4444' }]}>Sign Out Everywhere</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  rowSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 64,
  },
});
