import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';

export default function EvaluationScreen() {
  const nav = useNavigation<any>();
  return (
    <View style={styles.page}>
      <TopBar />
      <Card style={styles.card}>
        <Ionicons name="clipboard-outline" size={54} color={colors.primary} style={{ alignSelf: 'center' }} />
        <Text style={styles.title}>Course Evaluation</Text>
        <Text style={styles.body}>Course evaluation form will be displayed here.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  topBar: { height: 56, backgroundColor: '#0B0F14', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  topTitle: { color: 'white', fontWeight: '800' },
  campusText: { color: colors.primary },
  card: { margin: 14, alignItems: 'center', paddingVertical: 36 },
  title: { fontSize: 20, fontWeight: '900', color: '#181818', marginTop: 12 },
  body: { color: '#6B7280', marginTop: 8 },
});
