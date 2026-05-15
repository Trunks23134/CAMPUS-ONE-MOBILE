import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/colors';
const colors = theme.colors;
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';

const supportItems = [
  { icon: 'mail-outline', title: 'Email Support', desc: 'support@university.edu.ph', color: '#F59E0B' },
  { icon: 'call-outline', title: 'Phone Support', desc: '+63 2 1234 5678', color: '#3B82F6' },
  { icon: 'chatbubble-ellipses-outline', title: 'Live Chat', desc: 'Available Mon-Fri, 8AM-5PM', color: '#22C55E' },
] as const;

export default function HelpScreen() {
  const nav = useNavigation<any>();
  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Card style={styles.card}>
          <Text style={styles.title}>Help & Support</Text>
          {supportItems.map((item) => (
            <TouchableOpacity key={item.title} style={styles.supportCard} activeOpacity={0.9}>
              <View style={[styles.supportIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={22} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.supportTitle}>{item.title}</Text>
                <Text style={styles.supportDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  topBar: { height: 56, backgroundColor: '#0B0F14', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  topTitle: { color: 'white', fontWeight: '800' },
  campusText: { color: colors.primary },
  card: { margin: 14 },
  title: { fontSize: 20, fontWeight: '900', color: '#181818', marginBottom: 12 },
  supportCard: { flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 10 },
  supportIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  supportTitle: { color: '#111827', fontWeight: '600' },
  supportDesc: { color: '#6B7280', marginTop: 4 },
});
