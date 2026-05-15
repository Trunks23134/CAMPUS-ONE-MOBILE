import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { Ionicons } from '@expo/vector-icons';

const faqs = [
  { question: 'How do I encode grades?', answer: 'Go to the Encode Grades tab, select your subject, and click Edit Grades.' },
  { question: 'Can I export my student list?', answer: 'Yes, inside the Students tab, click the options menu to export.' },
];

export default function ProfessorHelp() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@campus.edu');
  };

  const handleReportIssue = () => {
    Linking.openURL('mailto:support@campus.edu?subject=Bug%20Report%20-%20Professor%20Portal');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>Find answers or contact support</Text>
      </View>

      <View style={styles.contactCard}>
        <View style={styles.contactIcon}>
          <Ionicons name="chatbubbles" size={32} color="#F59E0B" />
        </View>
        <Text style={styles.contactTitle}>Need immediate help?</Text>
        <Text style={styles.contactText}>Our support team is available Mon-Fri, 8AM to 5PM.</Text>
        
        <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <View style={styles.faqList}>
        {faqs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqCard} onPress={() => toggleFaq(index)} activeOpacity={0.7}>
            <View style={[styles.faqHeader, { marginBottom: expandedFaq === index ? 12 : 0 }]}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons name={expandedFaq === index ? "chevron-up" : "chevron-down"} size={20} color="#6b7280" />
            </View>
            {expandedFaq === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>System Info</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0 (Build 42)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Environment</Text>
          <Text style={styles.infoValue}>Production</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.reportButton} onPress={handleReportIssue}>
        <Ionicons name="warning-outline" size={20} color="#ef4444" />
        <Text style={styles.reportButtonText}>Report an Issue</Text>
      </TouchableOpacity>
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
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  faqList: {
    gap: 12,
    marginBottom: 32,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  reportButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
