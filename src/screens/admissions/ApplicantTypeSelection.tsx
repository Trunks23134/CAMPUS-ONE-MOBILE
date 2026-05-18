import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ApplicantType, SchoolLevel } from '../../types/admissions.types';

const AVAILABLE: Record<SchoolLevel, ApplicantType[]> = {
  Kinder: ['Freshman', 'Transferee', 'Returnee'],
  Elementary: ['Freshman', 'Transferee', 'Returnee'],
  'Junior High School': ['Freshman', 'Transferee', 'Returnee'],
  'Senior High School': ['Freshman', 'Transferee', 'Returnee'],
  College: ['Freshman', 'Transferee', 'Shiftee', 'Returnee'],
};

const TYPE_META: Record<ApplicantType, { desc: string }> = {
  Freshman: {
    desc: 'First-time applicant, no prior enrollment',
  },
  Transferee: {
    desc: 'Coming from another school or institution',
  },
  Shiftee: {
    desc: 'Changing program within the school',
  },
  Returnee: {
    desc: 'Returning after a leave or gap period',
  },
};

const ALL: ApplicantType[] = ['Freshman', 'Transferee', 'Shiftee', 'Returnee'];

interface Props {
  schoolLevel: SchoolLevel;
  selected: ApplicantType | null;
  onSelect: (type: ApplicantType) => void;
}

export default function ApplicantTypeSelection({ schoolLevel, selected, onSelect }: Props) {
  const available = AVAILABLE[schoolLevel];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>APPLICANT TYPE</Text>

      {ALL.map((type) => {
        const isAvail = available.includes(type);
        const isSel = selected === type;
        const meta = TYPE_META[type];

        return (
          <TouchableOpacity
            key={type}
            onPress={() => isAvail && onSelect(type)}
            disabled={!isAvail}
            style={[
              styles.option,
              !isAvail
                ? styles.optionDisabled
                : isSel
                  ? styles.optionSelected
                  : styles.optionDefault,
            ]}
            activeOpacity={isAvail ? 0.7 : 1}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionTitle,
                  !isAvail
                    ? styles.optionTitleDisabled
                    : isSel
                      ? styles.optionTitleSelected
                      : styles.optionTitleDefault,
                ]}
              >
                {type}
              </Text>
              <Text style={styles.optionSubtitle}>{meta.desc}</Text>
            </View>

            {!isAvail ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>N/A</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.radio,
                  isSel ? styles.radioSelected : styles.radioDefault,
                ]}
              >
                {isSel && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            )}
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
  optionDisabled: {
    borderColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
    opacity: 0.5,
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
  optionTitleDisabled: {
    color: '#9ca3af',
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
  badge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
});
