import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SchoolLevel } from '../../types/admissions.types';

const LEVELS: { level: SchoolLevel; sub: string }[] = [
  { level: 'Kinder', sub: 'Ages 5–6' },
  { level: 'Elementary', sub: 'Grades 1–6' },
  { level: 'Junior High School', sub: 'Grades 7–10' },
  { level: 'Senior High School', sub: 'Grades 11–12' },
  { level: 'College', sub: 'Undergraduate' },
];

interface Props {
  selected: SchoolLevel | null;
  onSelect: (level: SchoolLevel) => void;
}

export default function SchoolLevelSelection({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SCHOOL LEVEL</Text>

      {LEVELS.map(({ level, sub }) => {
        const isSelected = selected === level;

        return (
          <TouchableOpacity
            key={level}
            onPress={() => onSelect(level)}
            style={[
              styles.option,
              isSelected ? styles.optionSelected : styles.optionDefault,
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionTitle,
                  isSelected ? styles.optionTitleSelected : styles.optionTitleDefault,
                ]}
              >
                {level}
              </Text>
              <Text style={styles.optionSubtitle}>{sub}</Text>
            </View>

            <View
              style={[
                styles.radio,
                isSelected ? styles.radioSelected : styles.radioDefault,
              ]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionDefault: {
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionTitleDefault: {
    color: '#1f2937',
  },
  optionTitleSelected: {
    color: '#92400E',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDefault: {
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B',
  },
});
