import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type DocumentRequestPageProps = {
  theme: AppTheme;
  onBack: () => void;
};

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "gcash" | "card" | "counter";

type RequestForm = {
  documentType: string;
  copies: string;
  purpose: string;
  deliveryMethod: DeliveryMethod;
  agreed: boolean;
  address: string;
};

const documentTypes = [
  "Transcript of Records (TOR)",
  "Diploma Copy",
  "Certificate of Graduation",
  "Certificate of Good Moral Character",
  "Certificate of Enrollment",
  "Course Description",
];

const documentFees: Record<string, number> = {
  "Transcript of Records (TOR)": 500,
  "Diploma Copy": 350,
  "Certificate of Graduation": 180,
  "Certificate of Good Moral Character": 150,
  "Certificate of Enrollment": 150,
  "Course Description": 200,
};

const initialForm: RequestForm = {
  documentType: "",
  copies: "1",
  purpose: "",
  deliveryMethod: "pickup",
  agreed: false,
  address: "",
};

export default function DocumentRequestPage({
  theme,
  onBack,
}: DocumentRequestPageProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [typeOpen, setTypeOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gcash");
  const [form, setForm] = useState<RequestForm>(initialForm);

  const setField = <K extends keyof RequestForm>(key: K, value: RequestForm[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitRequest = (): void => {
    if (
      !form.documentType.trim() ||
      !form.copies.trim() ||
      !form.purpose.trim() ||
      (form.deliveryMethod === "delivery" && !form.address.trim())
    ) {
      Alert.alert("Missing details", "Please complete all required fields before submitting your request.");
      return;
    }

    if (Number(form.copies) < 1) {
      Alert.alert("Invalid copies", "Number of copies must be at least 1.");
      return;
    }

    if (!form.agreed) {
      Alert.alert("Consent required", "Please agree to the data privacy notice before continuing.");
      return;
    }

    setCheckoutOpen(true);
    setTypeOpen(false);
  };

  const unitFee = documentFees[form.documentType] ?? 150;
  const copiesCount = Math.max(Number(form.copies || "1"), 1);
  const processingFee = unitFee * copiesCount;
  const deliveryFee = form.deliveryMethod === "delivery" ? 150 : 0;
  const convenienceFee = 25;
  const total = processingFee + deliveryFee + convenienceFee;

  const confirmPayment = (): void => {
    Alert.alert(
      "Payment completed",
      `${form.documentType} request paid successfully. Total: P${total}. Your request is now queued for processing.`,
      [
        {
          text: "Done",
          onPress: () => {
            setForm(initialForm);
            setPaymentMethod("gcash");
            setCheckoutOpen(false);
          },
        },
      ],
    );
  };

  return (
    <>
      <PortalHeader
        theme={theme}
        leftAction={{ icon: "arrow-left", onPress: onBack, accessibilityLabel: "Go back" }}
        rightActions={[
          { icon: "magnify", onPress: () => setSearchOpen((prev) => !prev), accessibilityLabel: "Search" },
          {
            icon: "bell-outline",
            onPress: () => Alert.alert("Notifications", "No new document request updates right now."),
            accessibilityLabel: "Notifications",
            badge: true,
          },
        ]}
      >
        <Text style={[styles.topTitle, { color: theme.topBarText }]}>{checkoutOpen ? "Checkout" : "Document Request"}</Text>
      </PortalHeader>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.sectionBackground }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {checkoutOpen ? (
          <>
            <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}> 
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Order Summary</Text>
              <SummaryRow label="Document" value={form.documentType} theme={theme} />
              <SummaryRow label="Copies" value={String(copiesCount)} theme={theme} />
              <SummaryRow label="Unit Fee" value={`P${unitFee}`} theme={theme} />
              <SummaryRow label="Processing Fee" value={`P${processingFee}`} theme={theme} />
              <SummaryRow label="Delivery Fee" value={`P${deliveryFee}`} theme={theme} />
              <SummaryRow label="Convenience Fee" value={`P${convenienceFee}`} theme={theme} />
              <View style={[styles.totalRow, { borderTopColor: theme.divider }]}> 
                <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total</Text>
                <Text style={styles.totalValue}>P{total}</Text>
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}> 
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Payment Method</Text>
              <SelectOption
                title="GCash"
                subtitle="Recommended for instant confirmation"
                selected={paymentMethod === "gcash"}
                theme={theme}
                onPress={() => setPaymentMethod("gcash")}
              />
              <SelectOption
                title="Debit/Credit Card"
                subtitle="Visa / Mastercard"
                selected={paymentMethod === "card"}
                theme={theme}
                onPress={() => setPaymentMethod("card")}
              />
              <SelectOption
                title="Over-the-Counter"
                subtitle="Pay onsite before release"
                selected={paymentMethod === "counter"}
                theme={theme}
                onPress={() => setPaymentMethod("counter")}
              />
            </View>

            <View style={styles.checkoutActionRow}>
              <Pressable
                style={[styles.secondaryButton, { borderColor: theme.inputBorder }]}
                onPress={() => setCheckoutOpen(false)}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Back to Form</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={confirmPayment}>
                <Text style={styles.submitButtonText}>Pay & Confirm</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
        {searchOpen ? (
          <View style={[styles.helperCard, { backgroundColor: theme.sectionCardBackground }]}>
            <Text style={[styles.helperTitle, { color: theme.textPrimary }]}>Available document types</Text>
            {documentTypes.map((item) => (
              <Text key={item} style={[styles.helperItem, { color: theme.textSecondary }]}>
                • {item}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Processing Info</Text>
          <Text style={styles.infoText}>• Processing: 3-5 business days</Text>
          <Text style={styles.infoText}>• TOR: 5-7 business days</Text>
          <Text style={styles.infoText}>• Valid ID required for pick-up</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Document Details</Text>

          <Field label="Document Type" required theme={theme}>
            <View>
              <Pressable
                style={[
                  styles.dropdownTrigger,
                  { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
                ]}
                onPress={() => setTypeOpen((prev) => !prev)}
              >
                <Text style={[styles.dropdownText, { color: form.documentType ? theme.textPrimary : theme.textMuted }]}>
                  {form.documentType || "Select document"}
                </Text>
                <MaterialCommunityIcons
                  name={typeOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.textMuted}
                />
              </Pressable>

              {typeOpen ? (
                <View style={[styles.dropdownMenu, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
                  {documentTypes.map((item, index) => (
                    <Pressable
                      key={item}
                      style={[
                        styles.dropdownItem,
                        index < documentTypes.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider } : null,
                      ]}
                      onPress={() => {
                        setField("documentType", item);
                        setTypeOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: theme.textPrimary }]}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </Field>

          <Field label="Number of Copies" required theme={theme}>
            <TextInput
              value={form.copies}
              onChangeText={(value) => setField("copies", value.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              style={[
                styles.input,
                { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary },
              ]}
            />
          </Field>

          <Field label="Purpose of Request" required theme={theme}>
            <TextInput
              value={form.purpose}
              onChangeText={(value) => setField("purpose", value)}
              placeholder="e.g., Employment, Further Studies"
              placeholderTextColor={theme.textMuted}
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary },
              ]}
            />
          </Field>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Delivery Method</Text>

          <SelectOption
            title="Pick-up at Office"
            subtitle="FREE"
            selected={form.deliveryMethod === "pickup"}
            theme={theme}
            onPress={() => setField("deliveryMethod", "pickup")}
          />
          <SelectOption
            title="Delivery"
            subtitle="P150 shipping fee"
            selected={form.deliveryMethod === "delivery"}
            theme={theme}
            onPress={() => setField("deliveryMethod", "delivery")}
          />

          {form.deliveryMethod === "delivery" ? (
            <Field label="Delivery Address" required theme={theme}>
              <TextInput
                value={form.address}
                onChangeText={(value) => setField("address", value)}
                placeholder="House number, street, city"
                placeholderTextColor={theme.textMuted}
                multiline
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textPrimary },
                ]}
              />
            </Field>
          ) : null}
        </View>

        <Pressable
          style={[styles.privacyCard, { backgroundColor: theme.sectionCardBackground }]}
          onPress={() => setField("agreed", !form.agreed)}
        >
          <View style={[styles.checkWrap, form.agreed ? styles.checkWrapActive : null]}>
            {form.agreed ? <MaterialCommunityIcons name="check" size={16} color="#111111" /> : null}
          </View>
          <View style={styles.privacyTextWrap}>
            <Text style={[styles.privacyTitle, { color: theme.textPrimary }]}>
              DATA PRIVACY NOTICE
              <Text style={styles.required}> *</Text>
            </Text>
            <Text style={[styles.privacyText, { color: theme.textSecondary }]}>
              I authorize Campus One to collect and process my personal information for document request purposes in
              accordance with the Data Privacy Act of 2012.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={submitRequest}>
          <Text style={styles.submitButtonText}>Proceed to Checkout</Text>
        </Pressable>
          </>
        )}
      </ScrollView>
    </>
  );
}

function SummaryRow({ label, value, theme }: { label: string; value: string; theme: AppTheme }): React.JSX.Element {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

function Field({
  label,
  required = false,
  theme,
  children,
}: {
  label: string;
  required?: boolean;
  theme: AppTheme;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function SelectOption({
  title,
  subtitle,
  selected,
  theme,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  theme: AppTheme;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      style={[
        styles.optionCard,
        {
          backgroundColor: selected ? "#FFF8E1" : theme.inputBackground,
          borderColor: selected ? theme.topBarAccent : theme.inputBorder,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 16,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bellWrap: {
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  helperCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  helperItem: {
    fontSize: 13,
    lineHeight: 21,
  },
  infoCard: {
    backgroundColor: "#F5B400",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  infoTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoText: {
    color: "#111111",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  sectionCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#E53935",
  },
  dropdownTrigger: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
  },
  dropdownMenu: {
    borderWidth: 1.5,
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
  },
  textArea: {
    minHeight: 110,
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  privacyCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C6CDD8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkWrapActive: {
    backgroundColor: "#F5B400",
    borderColor: "#F5B400",
  },
  privacyTextWrap: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 13,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: "#F5B400",
    borderRadius: 18,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F5B400",
  },
  checkoutActionRow: {
    gap: 12,
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
