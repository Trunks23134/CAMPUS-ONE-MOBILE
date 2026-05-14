import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import Card from "../../../components/Card";
import { resolveTerm } from "../../../utils/termResolver";
import { fetchOfferings, isEnrollmentError, SubjectOffering } from "../../../api/enrollment";
import { useCart } from "../../../context/CartContext";
import { supabase } from "../../../lib/supabase";

export default function SubjectSearchScreen() {
  const nav = useNavigation<any>();
  const [q, setQ] = useState("");
  const [offerings, setOfferings] = useState<SubjectOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, hasItem } = useCart();
  const termRef = useRef<{ schoolYear: string; term: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const termResult = resolveTerm();
      if ("code" in termResult) {
        if (!cancelled) {
          setError(termResult.message);
          setLoading(false);
        }
        return;
      }

      const { schoolYear, term } = termResult;
      termRef.current = { schoolYear, term };
      const result = await fetchOfferings(schoolYear, term);

      if (cancelled) return;

      if (isEnrollmentError(result)) {
        setError(result.message);
        Alert.alert("Error", result.message);
      } else {
        setOfferings(result);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Realtime subscription: update slots_taken within ~2 seconds of any enrollment
  useEffect(() => {
    const channel = supabase
      .channel('subject_offerings_slots')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'subject_offerings' },
        (payload) => {
          const updated = payload.new as { id: string; slots_taken: number; slots_total: number };
          setOfferings((prev) =>
            prev.map((o) =>
              o.id === updated.id
                ? { ...o, slotsTaken: updated.slots_taken, isFull: updated.slots_taken >= updated.slots_total }
                : o
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return offerings;
    return offerings.filter(
      (x) => (x.subjectTitle + x.subjectCode + (x.instructor ?? "")).toLowerCase().includes(s)
    );
  }, [q, offerings]);

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          <Text style={{ color: colors.primary, fontWeight: "900" }}>CAMPUS</Text>{" "}
          <Text style={{ color: "white", fontWeight: "900" }}>Portal</Text>
        </Text>

        <View style={styles.topIcons}>
          <Ionicons name="search" size={18} color="white" />
          <View style={{ width: 14 }} />
          <View>
            <Ionicons name="notifications" size={18} color="white" />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </View>
          <View style={{ width: 14 }} />
          <Ionicons name="cart-outline" size={18} color="white" />
        </View>
      </View>

      <View style={{ padding: 14, flex: 1 }}>
        <Card>
          <Text style={styles.h1}>Welcome Username</Text>
          <Text style={styles.sub}>Find and enroll in your subjects</Text>

          <View style={styles.searchRow}>
            <Ionicons name="search" size={16} color="#6B7280" />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search subjects..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterRow}>
            <Ionicons name="funnel-outline" size={16} color="#6B7280" />
            <Text style={styles.filterText}>All Departments</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: "auto" }} />
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Available Subjects</Text>
            <Text style={styles.sectionMeta}>{loading ? "…" : `${data.length} results`}</Text>
          </View>
        </Card>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(x) => x.id}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
            renderItem={({ item }) => (
              <SubjectCard
                item={item}
                inCart={hasItem(item.id)}
                onAdd={() => {
                  const result = addItem({
                    offeringId: item.id,
                    subjectCode: item.subjectCode,
                    subjectTitle: item.subjectTitle,
                    units: item.units,
                    schedule: item.schedule,
                    instructor: item.instructor,
                    section: item.section,
                  });
                  if (!result.success && result.error) {
                    Alert.alert("Cannot Add", result.error);
                  }
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

type SubjectCardProps = {
  item: SubjectOffering;
  inCart: boolean;
  onAdd: () => void;
};

function SubjectCard({ item, inCart, onAdd }: SubjectCardProps) {
  const slotsAvailable = item.slotsTotal - item.slotsTaken;
  const slotsLabel = `${slotsAvailable} / ${item.slotsTotal} slots available`;

  return (
    <Card style={{ marginBottom: 10 }}>
      <View style={styles.subjectTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectTitle}>{item.subjectTitle}</Text>
          <Text style={styles.subjectCode}>{item.subjectCode}</Text>

          {item.schedule ? (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{item.schedule}</Text>
            </View>
          ) : null}

          {item.instructor ? (
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{item.instructor}</Text>
            </View>
          ) : null}

          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{slotsLabel}</Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[
              styles.addBtn,
              item.isFull && styles.addBtnDisabled,
              inCart && styles.addBtnAdded,
            ]}
            activeOpacity={0.9}
            onPress={onAdd}
            disabled={item.isFull || inCart}
          >
            {inCart ? (
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            ) : (
              <Ionicons name="add" size={18} color={item.isFull ? "#9CA3AF" : "#111827"} />
            )}
          </TouchableOpacity>
          <Text style={styles.units}>{item.units}</Text>
        </View>
      </View>

      <Text style={styles.unitsLabel}>Units</Text>
    </Card>
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
  topIcons: { flexDirection: "row", alignItems: "center" },
  badge: {
    position: "absolute",
    right: -8,
    top: -6,
    backgroundColor: "#EF4444",
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "900" },

  h1: { fontSize: 16, fontWeight: "900", color: "#111827" },
  sub: { marginTop: 4, color: "#6B7280", fontSize: 12.5 },

  searchRow: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, color: "#111827", fontSize: 13 },

  filterRow: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterText: { color: "#111827", fontWeight: "700", fontSize: 12.8 },

  sectionHead: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { fontWeight: "900", color: "#111827" },
  sectionMeta: { color: "#6B7280", fontSize: 12.5 },

  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  errorText: { color: "#EF4444", textAlign: "center", fontSize: 13 },

  subjectTop: { flexDirection: "row", gap: 10 },
  subjectTitle: { fontWeight: "900", color: "#111827" },
  subjectCode: { color: "#6B7280", marginTop: 2, fontSize: 12.2 },

  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { marginLeft: 6, color: "#374151", fontSize: 12.5 },

  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  addBtnAdded: {
    backgroundColor: "#22C55E",
  },
  units: { fontWeight: "900", color: "#111827", fontSize: 14 },
  unitsLabel: { color: "#6B7280", fontSize: 12.2, marginTop: 6 },
});



