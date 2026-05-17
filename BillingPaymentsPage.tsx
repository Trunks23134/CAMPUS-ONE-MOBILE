import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import PortalHeader from "./PortalHeader";
import { getPaidPayments, getPendingPayments, mockPayments } from "./portalData";
import { AppTheme } from "./theme";

type BillingPaymentsPageProps = {
  theme: AppTheme;
  onOpenMenu: () => void;
};

export default function BillingPaymentsPage({ theme, onOpenMenu }: BillingPaymentsPageProps): React.JSX.Element {
  const pendingPayments = getPendingPayments(mockPayments);
  const paymentHistory = getPaidPayments(mockPayments);
  const pendingInvoice = pendingPayments[0];

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
            onPress: () => Alert.alert("Notifications", "You have 1 outstanding invoice reminder."),
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.topBarText }]}>Payments</Text>
      </PortalHeader>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Payments</Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Pay outstanding invoices and review payment history
          </Text>
        </View>

        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Unpaid Invoices</Text>
        <View style={[styles.invoiceCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.invoiceCopy}>
            <Text style={[styles.invoiceTitle, { color: theme.textPrimary }]}>{pendingInvoice?.service ?? "No unpaid invoices"}</Text>
            <Text style={[styles.invoiceDate, { color: theme.textSecondary }]}>{pendingInvoice?.createdAt ?? "All invoices cleared"}</Text>
          </View>

          <View style={styles.invoiceActionWrap}>
            <Text style={[styles.invoiceAmount, { color: theme.textPrimary }]}>
              {pendingInvoice?.amount ? `P${pendingInvoice.amount}` : "P0"}
            </Text>
            <Pressable style={styles.payButton} onPress={() => Alert.alert("Payment", "Payment flow can be connected here.")}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[styles.sectionHeading, styles.historyHeading, { color: theme.textPrimary }]}>Payment History</Text>
        <View style={[styles.tableCard, { backgroundColor: theme.sectionCardBackground, borderColor: theme.cardBorder }]}>
          <View style={[styles.tableHeader, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.tableHeaderText, styles.idColumn]}>TRANSACTION ID</Text>
            <Text style={[styles.tableHeaderText, styles.serviceColumn]}>SERVICE</Text>
            <Text style={[styles.tableHeaderText, styles.amountColumn]}>AMOUNT</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn]}>DATE</Text>
          </View>

          {paymentHistory.map((payment, index) => (
            <View
              key={payment.transactionId}
              style={[styles.tableRow, index < paymentHistory.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider } : null]}
            >
              <View style={styles.idColumn}>
                <Text style={[styles.idText, { color: theme.textPrimary }]}>{payment.transactionId}</Text>
                <Pressable onPress={() => Alert.alert("Receipt", `${payment.receiptLabel} is not connected yet.`)}>
                  <Text style={styles.receiptLink}>{payment.receiptLabel}</Text>
                </Pressable>
              </View>

              <Text style={[styles.tableCell, styles.serviceColumn, { color: theme.textPrimary }]}>{payment.service}</Text>
              <Text style={[styles.tableCell, styles.amountColumn, { color: theme.textPrimary }]}>{`P${payment.amount}`}</Text>
              <Text style={[styles.tableCell, styles.dateColumn, { color: theme.textPrimary }]}>{payment.createdAt}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={onOpenMenu}>
          <Text style={styles.backLink}>Back to dashboard</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
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
  heroCopy: {
    marginBottom: 26,
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
  sectionHeading: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  invoiceCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  invoiceCopy: {
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  invoiceDate: {
    fontSize: 14,
  },
  invoiceActionWrap: {
    alignItems: "flex-end",
    gap: 10,
  },
  invoiceAmount: {
    fontSize: 22,
    fontWeight: "900",
  },
  payButton: {
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: "#356AE6",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  historyHeading: {
    marginTop: 34,
  },
  tableCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
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
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  idColumn: {
    flex: 1.2,
  },
  serviceColumn: {
    flex: 1.3,
  },
  amountColumn: {
    flex: 0.9,
  },
  dateColumn: {
    flex: 1,
  },
  idText: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 16,
  },
  receiptLink: {
    color: "#2962FF",
    fontSize: 13,
    fontWeight: "600",
  },
  tableCell: {
    fontSize: 13,
    lineHeight: 20,
    paddingRight: 8,
  },
  backLink: {
    marginTop: 30,
    color: "#2962FF",
    fontSize: 14,
    fontWeight: "600",
  },
});
