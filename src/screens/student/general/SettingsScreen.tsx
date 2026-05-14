import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';
const colors = theme.colors;
import Card from '../../../components/Card';
import TopBar from '../../../components/TopBar';

const items = [
  { icon: 'notifications-outline', title: 'Notifications', desc: 'Manage notification preferences' },
  { icon: 'lock-closed-outline', title: 'Privacy & Security', desc: 'Change password and security settings' },
  { icon: 'globe-outline', title: 'Language', desc: 'English (US)' },
  { icon: 'moon-outline', title: 'Dark Mode', desc: 'Toggle dark mode' },
] as const;

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Card style={styles.card}>
          <Text style={styles.title}>Settings</Text>
          {items.map((item) => (
            <TouchableOpacity key={item.title} style={styles.itemCard} activeOpacity={0.9}>
              <View style={styles.itemIcon}><Ionicons name={item.icon} size={20} color="#6B7280" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
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
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 10 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#111827', fontWeight: '600' },
  itemDesc: { color: '#6B7280', marginTop: 4 },
});



