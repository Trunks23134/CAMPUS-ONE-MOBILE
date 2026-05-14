import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabase';

export default function LogoutScreen() {
  useEffect(() => {
    supabase.auth.signOut();
    // AuthContext detects session change → RootNavigator shows Welcome screen automatically
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
});



