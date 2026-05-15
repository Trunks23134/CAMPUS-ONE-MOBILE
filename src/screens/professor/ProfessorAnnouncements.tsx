import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockAnnouncements = [
  {
    id: '1',
    title: 'Midterm Exam Schedule Update',
    description: 'Please be informed that the midterm exam for CS101 has been moved to next Friday. Coverages will remain the same.',
    date: 'Oct 15, 2025',
    target: 'CS101 - Section A',
  },
  {
    id: '2',
    title: 'No Class on Monday',
    description: 'Due to the university-wide faculty meeting, all synchronous classes for Monday are cancelled. Please read chapter 4 asynchronously.',
    date: 'Oct 10, 2025',
    target: 'All Classes',
  },
];

export default function ProfessorAnnouncements() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Announcements</Text>
          <Text style={styles.subtitle}>Notify your students and manage posts</Text>
        </View>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {mockAnnouncements.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="megaphone-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateTitle}>No Announcements Yet</Text>
          <Text style={styles.emptyStateText}>You haven't posted any announcements for your classes.</Text>
          <TouchableOpacity style={styles.emptyCreateButton}>
            <Text style={styles.emptyCreateButtonText}>Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.list}>
          {mockAnnouncements.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="megaphone" size={20} color="#F59E0B" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
              </View>
              
              <Text style={styles.cardDescription}>{item.description}</Text>
              
              <View style={styles.cardFooter}>
                <Ionicons name="people" size={14} color="#6b7280" />
                <Text style={styles.targetText}>To: {item.target}</Text>
                
                <View style={{ flex: 1 }} />
                
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="pencil" size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  targetText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyCreateButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyCreateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
