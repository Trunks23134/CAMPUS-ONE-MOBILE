import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";
import { mockRequests, type PortalRequest, type RequestStatus } from "./portalData";

type MyRequestsPageProps = {
  theme: AppTheme;
  onOpenMenu: () => void;
};

type ServiceFilter = "All Service Types" | "Card Application" | "Document Request" | "Clearance Tracker" | "My Requests" | "Billing & Payments";
type StatusFilter = "All Statuses" | RequestStatus;

const serviceFilters: ServiceFilter[] = [
  "All Service Types",
  "Card Application",
  "Document Request",
  "Clearance Tracker",
  "My Requests",
  "Billing & Payments",
];

const statusFilters: StatusFilter[] = ["All Statuses", "Processing", "Ready for Pickup", "Shipped", "Completed"];

function statusColors(status: RequestStatus): { backgroundColor: string; color: string } {
  if (status === "Ready for Pickup") {
    return { backgroundColor: "#E8F8EE", color: "#14804A" };
  }

  if (status === "Completed") {
    return { backgroundColor: "#EAF2FF", color: "#2356C8" };
  }

  if (status === "Shipped") {
    return { backgroundColor: "#EEF2FF", color: "#4157B2" };
  }

  return { backgroundColor: "#FCEBD9", color: "#DD7A05" };
}

export default function MyRequestsPage({ theme, onOpenMenu }: MyRequestsPageProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("All Service Types");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");

  const visibleRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return mockRequests.filter((request) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        request.id.toLowerCase().includes(normalizedQuery) ||
        request.title.toLowerCase().includes(normalizedQuery) ||
        request.description?.toLowerCase().includes(normalizedQuery);

      const matchesService = serviceFilter === "All Service Types" || request.serviceType === serviceFilter;
      const matchesStatus = statusFilter === "All Statuses" || request.status === statusFilter;

      return matchesQuery && matchesService && matchesStatus;
    });
  }, [query, serviceFilter, statusFilter]);

  const activeRequests = visibleRequests.filter((request) => request.status !== "Completed");

  return (
    <View style={[styles.screen, { backgroundColor: theme.sectionBackground }]}>
      <PortalHeader
        theme={theme}
        leftAction={{ icon: "menu", accessibilityLabel: "Open navigation menu", onPress: onOpenMenu }}
        rightActions={[
          {
            icon: "bell-outline",
            accessibilityLabel: "Notifications",
            badge: true,
            onPress: () => Alert.alert("Notifications", "You have 3 request updates."),
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.topBarText }]}>Requests</Text>
      </PortalHeader>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Active Applications</Text>
            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
              View and manage all your requests and applications
            </Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => Alert.alert("New Request", "Start a new request from the matching service screen.")}>
            <Text style={styles.primaryButtonText}>+ New Request</Text>
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by ID, title, or description..."
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary }]}
        />

        <View style={styles.filterRow}>
          <FilterBox
            label={serviceFilter}
            onPress={() => cycleSelection(serviceFilters, serviceFilter, setServiceFilter)}
            theme={theme}
          />
          <FilterBox
            label={statusFilter}
            onPress={() => cycleSelection(statusFilters, statusFilter, setStatusFilter)}
            theme={theme}
          />
        </View>

        <View style={[styles.tableCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder }]}>
          <View style={[styles.tableHeader, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.tableHeaderText, styles.idColumn]}>REFERENCE ID</Text>
            <Text style={[styles.tableHeaderText, styles.serviceColumn]}>SERVICE TYPE</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn]}>DATE SUBMITTED</Text>
            <Text style={[styles.tableHeaderText, styles.statusColumn]}>STATUS</Text>
          </View>

          {activeRequests.map((request, index) => (
            <RequestRow key={request.id} request={request} bordered={index < activeRequests.length - 1} theme={theme} />
          ))}
        </View>

        <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
          Showing <Text style={styles.footerHighlight}>{activeRequests.length}</Text> of <Text style={styles.footerHighlight}>{mockRequests.length}</Text> requests
        </Text>
      </ScrollView>
    </View>
  );
}

function RequestRow({
  request,
  bordered,
  theme,
}: {
  request: PortalRequest;
  bordered: boolean;
  theme: AppTheme;
}): React.JSX.Element {
  const pill = statusColors(request.status);

  return (
    <View style={[styles.tableRow, bordered ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider } : null]}>
      <Text style={[styles.tableCellId, styles.idColumn, { color: theme.textPrimary }]}>{request.id}</Text>
      <Text style={[styles.tableCell, styles.serviceColumn, { color: theme.textSecondary }]}>{request.serviceType}</Text>
      <Text style={[styles.tableCell, styles.dateColumn, { color: theme.textSecondary }]}>{request.submittedAt}</Text>
      <View style={styles.statusColumn}>
        <Text style={[styles.statusPill, { backgroundColor: pill.backgroundColor, color: pill.color }]}>{request.status}</Text>
      </View>
    </View>
  );
}

function FilterBox({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: AppTheme;
}): React.JSX.Element {
  return (
    <Pressable style={[styles.filterBox, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]} onPress={onPress}>
      <Text style={[styles.filterLabel, { color: theme.textPrimary }]}>{label}</Text>
      <Text style={[styles.filterArrow, { color: theme.textSecondary }]}>v</Text>
    </Pressable>
  );
}

function cycleSelection<T>(values: readonly T[], current: T, setter: (value: T) => void): void {
  const currentIndex = values.indexOf(current);
  const nextIndex = currentIndex === values.length - 1 ? 0 : currentIndex + 1;
  setter(values[nextIndex]);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 22,
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#356AE6",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  searchInput: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  filterBox: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    fontSize: 14,
  },
  filterArrow: {
    fontSize: 14,
    fontWeight: "700",
  },
  tableCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  idColumn: {
    flex: 1.2,
  },
  serviceColumn: {
    flex: 1.5,
  },
  dateColumn: {
    flex: 1.2,
  },
  statusColumn: {
    flex: 1.3,
    alignItems: "flex-start",
  },
  tableCellId: {
    fontSize: 13,
    fontWeight: "800",
  },
  tableCell: {
    fontSize: 13,
    lineHeight: 20,
    paddingRight: 8,
  },
  statusPill: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "700",
  },
  footerNote: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
  },
  footerHighlight: {
    color: "#2454BF",
    fontWeight: "700",
  },
});
