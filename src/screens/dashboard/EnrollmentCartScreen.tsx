import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme/colors";
import Card from "../../components/Card";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  fetchStudent,
  submitEnrollment,
  isEnrollmentError,
} from "../../api/enrollment";
import { resolveTerm, TermResult } from "../../utils/termResolver";

const colors = theme.colors;

export default function SubjectCartScreen() {
  const nav = useNavigation<any>();
  const { items, totalUnits, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchStudent(user.id).then((result) => {
      if (!isEnrollmentError(result)) {
        setStudentId(result.id);
      }
    });
  }, [user]);

  const handleSubmit = async () => {
    if (!studentId || items.length === 0) return;

    const termResult = resolveTerm();
    if ("code" in termResult) {
      Alert.alert("Error", termResult.message);
      return;
    }
    const { schoolYear, term } = termResult as TermResult;

    setSubmitting(true);
    const result = await submitEnrollment(
      studentId,
      schoolYear,
      term,
      items.map((i) => i.offeringId),
    );
    setSubmitting(false);
    setOpen(false);

    if (isEnrollmentError(result)) {
      Alert.alert("Enrollment Failed", result.message);
    } else {
      clearCart();
      Alert.alert(
        "Enrollment Submitted",
        `Your enrollment has been submitted for review.\nEnrollment ID: ${result.enrollmentId}`,
      );
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          <Text style={{ color: colors.primary, fontWeight: "900" }}>CAMPUS</Text>{" "}
          <Text style={{ color: "white", fontWeight: "900" }}>Portal</Text>
        </Text>

        <Ionicons name="cart-outline" size={18} color="white" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
        <Text style={styles.h1}>Subject Cart</Text>
        <Text style={styles.sub}>Review your selected subjects before enrolling</Text>

        {items.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="cart-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add subjects from the search page to get started</Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.9}
              onPress={() => nav.navigate("Enrollment Search")}
            >
              <Text style={styles.primaryText}>Browse Subjects</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {items.map((cartItem) => (
              <Card key={cartItem.offeringId}>
                <View style={styles.rowBetween}>
                  <Text style={styles.courseTitle}>{cartItem.subjectTitle}</Text>
                  <TouchableOpacity onPress={() => removeItem(cartItem.offeringId)}>
                    <Ionicons name="close" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.courseCode}>{cartItem.subjectCode}</Text>

                {cartItem.schedule && (
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{cartItem.schedule}</Text>
                  </View>
                )}
                {cartItem.instructor && (
                  <View style={styles.metaRow}>
                    <Ionicons name="person-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{cartItem.instructor}</Text>
                  </View>
                )}

                <View style={styles.unitsRow}>
                  <Text style={styles.unitsLabel}>Units</Text>
                  <Text style={styles.unitsValue}>{cartItem.units}</Text>
                </View>
              </Card>
            ))}

            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Enrollment Summary</Text>

              <SumRow label="Total Subjects" value={String(items.length)} />
              <SumRow label="Total Units" value={String(totalUnits)} valueAccent />

              <View style={styles.limitRow}>
                <Text style={styles.limitLabel}>Units Limit</Text>
                <Text style={styles.limitValue}>24 units</Text>
              </View>

              <View style={styles.bullets}>
                <Bullet text="Review your selected subjects carefully" />
                <Bullet text="Enrollment is subject to slot availability" />
                <Bullet text="Changes can be made during add/drop period" />
              </View>
            </Card>

            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.9}
              onPress={() => setOpen(true)}
            >
              <Text style={styles.submitText}>Submit for Review</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Submit for Review</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to submit {items.length} subject{items.length !== 1 ? "s" : ""} ({totalUnits} units)? This will send your enrollment for review.
            </Text>

            <TouchableOpacity
              style={[styles.modalPrimary, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.9}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#111827" />
              ) : (
                <Text style={styles.modalPrimaryText}>Submit</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondary}
              onPress={() => setOpen(false)}
              disabled={submitting}
              activeOpacity={0.9}
            >
              <Text style={styles.modalSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SumRow({ label, value, valueAccent }: { label: string; value: string; valueAccent?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={[styles.sumValue, valueAccent && { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },

  topBar: {
    height: 56,
    backgroundColor: "#0B0F14",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  topTitle: { fontSize: 13.5 },

  h1: { fontSize: 18, fontWeight: "900", color: "#111827" },
  sub: { marginTop: 4, color: "#6B7280", fontSize: 12.5, marginBottom: 12 },

  emptyCard: { alignItems: "center", paddingVertical: 26 },
  emptyTitle: { marginTop: 10, fontWeight: "900", color: "#111827" },
  emptySub: { marginTop: 6, color: "#6B7280", fontSize: 12.5, textAlign: "center" },

  primaryBtn: {
    marginTop: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontWeight: "900", color: "#111827" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  courseTitle: { fontWeight: "900", color: "#111827", flex: 1, marginRight: 8 },
  courseCode: { color: "#6B7280", marginTop: 2, fontSize: 12.2 },

  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { marginLeft: 6, color: "#374151", fontSize: 12.5 },

  unitsRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
  unitsLabel: { color: "#6B7280", fontSize: 12.2 },
  unitsValue: { fontWeight: "900", color: "#111827" },

  summaryCard: { backgroundColor: "#0B1220" },
  summaryTitle: { color: "white", fontWeight: "900", marginBottom: 10 },

  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  sumLabel: { color: "#D1D5DB", fontWeight: "700", fontSize: 12.5 },
  sumValue: { color: "white", fontWeight: "900", fontSize: 12.5 },

  limitRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  limitLabel: { color: "#9CA3AF", fontWeight: "700", fontSize: 12.2 },
  limitValue: { color: "#9CA3AF", fontWeight: "900", fontSize: 12.2 },

  bullets: { marginTop: 10 },
  bulletRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#9CA3AF" },
  bulletText: { color: "#9CA3AF", fontSize: 12.2 },

  submitBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontWeight: "900", color: "#111827" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
  },
  modalTitle: { fontWeight: "900", color: "#111827", textAlign: "center" },
  modalSub: { marginTop: 10, color: "#6B7280", fontSize: 12.5, textAlign: "center" },

  modalPrimary: {
    marginTop: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: { fontWeight: "900", color: "#111827" },

  modalSecondary: {
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: { fontWeight: "900", color: "#111827" },
});
