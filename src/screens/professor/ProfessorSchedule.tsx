import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const mockSchedule = [
  { id: '1', subject: 'CS101', name: 'Intro to CS', time: '09:00 AM - 10:00 AM', room: 'Room 301', day: 'Mon', current: false },
  { id: '2', subject: 'CS101', name: 'Intro to CS', time: '09:00 AM - 10:00 AM', room: 'Room 301', day: 'Wed', current: false },
  { id: '3', subject: 'CS101', name: 'Intro to CS', time: '09:00 AM - 10:00 AM', room: 'Room 301', day: 'Fri', current: false },
  { id: '4', subject: 'CS201', name: 'Data Structures', time: '10:30 AM - 12:00 PM', room: 'Room 302', day: 'Tue', current: true },
  { id: '5', subject: 'CS201', name: 'Data Structures', time: '10:30 AM - 12:00 PM', room: 'Room 302', day: 'Thu', current: false },
];

export default function ProfessorSchedule() {
  const [selectedDay, setSelectedDay] = useState('Tue');
  const actualToday = 'Tue'; // Mock real current day

  const selectedDayClasses = mockSchedule.filter(s => s.day === selectedDay);
  const otherClasses = mockSchedule.filter(s => s.day !== selectedDay);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>Manage your classes and office hours</Text>
      </View>

      {/* Week Tabs */}
      <View style={styles.weekContainer}>
        {weekDays.map((day) => (
          <TouchableOpacity 
            key={day} 
            style={[styles.dayTab, day === selectedDay && styles.dayTabActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayText, day === selectedDay && styles.dayTextActive]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.scheduleList}>
        <Text style={styles.sectionTitle}>
          {selectedDay === actualToday ? "Today's Classes" : `Classes on ${selectedDay}`}
        </Text>
        
        {selectedDayClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No classes scheduled for this day.</Text>
          </View>
        ) : (
          selectedDayClasses.map(item => (
            <View key={item.id} style={[styles.card, item.current && selectedDay === actualToday && styles.cardCurrent]}>
              {item.current && selectedDay === actualToday && (
                <View style={styles.currentBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.currentBadgeText}>Ongoing</Text>
                </View>
              )}
              <View style={styles.cardHeader}>
                <Text style={styles.subjectCode}>{item.subject}</Text>
                <Text style={styles.subjectName}>{item.name}</Text>
              </View>
              
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={item.current && selectedDay === actualToday ? '#b45309' : '#6b7280'} />
                  <Text style={[styles.detailText, item.current && selectedDay === actualToday && styles.detailTextCurrent]}>{item.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color={item.current && selectedDay === actualToday ? '#b45309' : '#6b7280'} />
                  <Text style={[styles.detailText, item.current && selectedDay === actualToday && styles.detailTextCurrent]}>{item.room}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other Classes This Week</Text>
        {otherClasses.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeaderUpcoming}>
              <Text style={styles.dayBadge}>{item.day}</Text>
              <Text style={styles.subjectCodeUpcoming}>{item.subject}</Text>
            </View>
            <View style={styles.cardDetailsUpcoming}>
              <Text style={styles.detailText}>{item.time}</Text>
              <Text style={styles.detailText}>•</Text>
              <Text style={styles.detailText}>{item.room}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
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
  weekContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 4,
    marginBottom: 24,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  dayTabActive: {
    backgroundColor: '#111827',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  dayTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scheduleList: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardCurrent: {
    borderColor: '#F59E0B',
    backgroundColor: '#fffbeb',
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: '#fef3c7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
  },
  cardHeader: {
    marginBottom: 12,
  },
  subjectCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  detailTextCurrent: {
    color: '#b45309',
  },
  cardHeaderUpcoming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dayBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  subjectCodeUpcoming: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardDetailsUpcoming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
