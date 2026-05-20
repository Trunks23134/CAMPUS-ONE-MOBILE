import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface AdmissionsHomeProps {
  navigation: any;
}

export default function AdmissionsHome({ navigation }: AdmissionsHomeProps) {
  const handleOpenWebApplication = () => {
    // Navigate to WebView screen
    navigation.navigate('AdmissionsWebView');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="school-outline" size={20} color="#F59E0B" />
          <Text style={styles.headerText}>CAMPUS Portal</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Admissions</Text>
          <Text style={styles.subtitle}>Start your application process</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="information-circle" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.infoTitle}>Application Form</Text>
          <Text style={styles.infoText}>
            The full application form is available on the web version of CAMPUS Portal.
          </Text>
          <Text style={styles.infoText}>
            Tap the button below to open the application form in your browser.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.openWebButton}
          onPress={handleOpenWebApplication}
        >
          <Ionicons name="globe-outline" size={20} color="#fff" />
          <Text style={styles.openWebButtonText}>Open Application Form</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.requirementsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>What You'll Need</Text>
          </View>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.requirementText}>Personal information</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.requirementText}>Academic records</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.requirementText}>Contact details</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.requirementText}>Program preferences</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => navigation.navigate('ApplicationTracking')}
        >
          <Ionicons name="search-outline" size={18} color="#fff" />
          <Text style={styles.trackButtonText}>Track Existing Application</Text>
        </TouchableOpacity>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>Need help? Contact admissions office</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3748',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e0',
  },
  infoCard: {
    backgroundColor: '#1a202c',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#cbd5e0',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 6,
  },
  openWebButton: {
    backgroundColor: '#F59E0B',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  openWebButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  requirementsCard: {
    backgroundColor: '#1a202c',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  requirementsList: {
    gap: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 13,
    color: '#cbd5e0',
  },
  trackButton: {
    backgroundColor: '#4a5568',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 32,
  },
  helpText: {
    fontSize: 12,
    color: '#a0aec0',
  },
});
