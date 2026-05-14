
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { getFontStyle, themeFont } from '../theme/fonts';

interface Props {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, secondary, style }: Props) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        secondary && styles.buttonSecondary,
        style
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.text, secondary && styles.textSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0.1,
  },
  text: {
    color: 'white',
    textAlign: 'center',
...getFontStyle('semiBold'),
    fontSize: 16,
  },
  textSecondary: {
    color: colors.primary,
  },
});

