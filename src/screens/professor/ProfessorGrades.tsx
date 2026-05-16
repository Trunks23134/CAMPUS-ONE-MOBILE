import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const subjects = ['CS101 - Intro to CS', 'CS201 - Data Structures'];
const semesters = ['1st Semester 2025-2026', '2nd Semester 2025-2026'];

const mockGrades = [
  { id: '1', name: 'Alice Johnson', studentId: '2023-00124', prelim: '1.25', midterm: '1.50', final: '-', status: 'Pending' },
  { id: '2', name: 'Mark Williams', studentId: '2023-00452', prelim: '1.50', midterm: '1.75', final: '1.50', status: 'Submitted' },
  { id: '3', name: 'James Smith', studentId: '2024-00056', prelim: '2.00', midterm: '-', final: '-', status: 'Pending' },
];

export default function ProfessorGrades() {
  const [subject, setSubject] = useState(subjects[0]);
  const [semester, setSemester] = useState(semesters[0]);

  const [grades, setGrades] = useState(mockGrades);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGrades, setTempGrades] = useState(mockGrades);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<'subject' | 'semester'>('subject');

  const openDropdown = (type: 'subject' | 'semester') => {
    setDropdownType(type);
    setDropdownVisible(true);
  };

  const handleSelectDropdown = (item: string) => {
    if (dropdownType === 'subject') setSubject(item);
    else setSemester(item);
    setDropdownVisible(false);
  };

  const handleEdit = () => {
    setTempGrades([...grades]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setGrades([...tempGrades]);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    const updated = grades.map(g => ({ ...g, status: 'Submitted' }));
    setGrades(updated);
    setTempGrades(updated);
  };

  const updateGrade = (id: string, field: 'prelim' | 'midterm' | 'final', value: string) => {
    setTempGrades(tempGrades.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Encode Grades</Text>
        <Text style={styles.subtitle}>Input and manage student grades</Text>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.dropdown} onPress={() => openDropdown('semester')}>
          <Text style={styles.dropdownLabel}>Semester</Text>
          <View style={styles.dropdownInner}>
            <Text style={styles.dropdownText}>{semester}</Text>
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown} onPress={() => openDropdown('subject')}>
          <Text style={styles.dropdownLabel}>Subject</Text>
          <View style={styles.dropdownInner}>
            <Text style={styles.dropdownText}>{subject}</Text>
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 2 }]}>Student</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Prelim</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Mid</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Final</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Status</Text>
        </View>

        {(isEditing ? tempGrades : grades).map((grade, index) => (
          <View key={grade.id} style={[styles.tableRow, index === mockGrades.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={{ flex: 2 }}>
              <Text style={styles.studentName} numberOfLines={1}>{grade.name}</Text>
              <Text style={styles.studentId}>{grade.studentId}</Text>
            </View>
            
            {isEditing ? (
              <>
                <TextInput 
                  style={[styles.gradeInput, { flex: 1 }]} 
                  value={grade.prelim} 
                  onChangeText={(val) => updateGrade(grade.id, 'prelim', val)}
                  keyboardType="numeric"
                />
                <TextInput 
                  style={[styles.gradeInput, { flex: 1 }]} 
                  value={grade.midterm} 
                  onChangeText={(val) => updateGrade(grade.id, 'midterm', val)}
                  keyboardType="numeric"
                />
                <TextInput 
                  style={[styles.gradeInput, { flex: 1 }]} 
                  value={grade.final} 
                  onChangeText={(val) => updateGrade(grade.id, 'final', val)}
                  keyboardType="numeric"
                />
              </>
            ) : (
              <>
                <Text style={[styles.cellText, { flex: 1 }]}>{grade.prelim}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{grade.midterm}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{grade.final}</Text>
              </>
            )}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={[styles.badge, grade.status === 'Submitted' ? styles.badgeSuccess : styles.badgeWarning]}>
                <Ionicons 
                  name={grade.status === 'Submitted' ? 'checkmark-circle' : 'time'} 
                  size={12} 
                  color={grade.status === 'Submitted' ? '#166534' : '#b45309'} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {isEditing ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineButton} onPress={handleCancel}>
            <Ionicons name="close" size={20} color="#4b5563" />
            <Text style={styles.outlineButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={20} color="#4b5563" />
            <Text style={styles.outlineButtonText}>Edit Grades</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Ionicons name="cloud-upload" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Submit Grades</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal visible={dropdownVisible} transparent={true} animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {dropdownType === 'subject' ? 'Subject' : 'Semester'}</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={dropdownType === 'subject' ? subjects : semesters}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={() => handleSelectDropdown(item)}
                >
                  <Text style={[styles.modalOptionText, (dropdownType === 'subject' ? subject : semester) === item && styles.modalOptionActive]}>{item}</Text>
                  {(dropdownType === 'subject' ? subject : semester) === item && (
                    <Ionicons name="checkmark" size={20} color="#F59E0B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  filters: {
    gap: 12,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dropdownInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  studentId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    height: 48,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  gradeInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginHorizontal: 4,
    fontSize: 14,
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#4b5563',
  },
  modalOptionActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
});
