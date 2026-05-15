import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { getFontStyle } from '../theme/fonts';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
  onBackPress?: () => void;
}

export default function Header({
  title,
  onMenuPress,
  onBackPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

      <Ionicons name="notifications-outline" size={22} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
title: {
    color: 'white',
    fontSize: 18,
    ...getFontStyle('semiBold'),
  },
});