import React, { useMemo, useState } from "react";
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

type CardApplicationPageProps = {
  theme: AppTheme;
  onBack: () => void;
  userFullName?: string;
  userEmail?: string;
  studentId?: string;
};

type CardForm = {
  cardType: "new" | "replacement";
  fullName: string;
  email: string;
  studentId: string;
  graduationYear: string;
  phone: string;
  deliveryMethod: "pickup" | "delivery";
  address: string;
  agreed: boolean;
};

const initialForm: CardForm = {
  cardType: "new",
  fullName: "",
  email: "",
  studentId: "",
  graduationYear: "",
  phone: "",
  deliveryMethod: "pickup",
  address: "",
  agreed: false,
};

export default function CardApplicationPage({
  theme,
  onBack,
  userFullName = "John Doe",
  userEmail = "jertznaval57@gmail.com",
  studentId = "202012345",
}: CardApplicationPageProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [form, setForm] = useState<CardForm>({
    ...initialForm,
    fullName: userFullName,
    email: userEmail,
    studentId,
  });

  const processingMessage = useMemo(() => {
    return form.cardType === "replacement"
      ? "Replacement card applications are processed in 5-7 business days."
      : "New alumni cards are processed in 3-5 business days.";
  }, [form.cardType]);

  const setField = <K extends keyof CardForm>(key: K, value: CardForm[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitApplication = (): void => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.studentId.trim() ||
      !form.graduationYear.trim() ||
      !form.phone.trim() ||
      (form.deliveryMethod === "delivery" && !form.address.trim())
    ) {
      Alert.alert("Missing details", "Please complete all required fields before submitting your card application.");
      return;
    }

    if (!form.agreed) {
      Alert.alert("Consent required", "Please confirm the data privacy notice before submitting.");
      return;
    }

    Alert.alert(
      "Application submitted",
      `Your ${form.cardType === "replacement" ? "replacement" : "alumni"} card request has been submitted successfully.`,
      [
        {
          text: "OK",
          onPress: () =>
            setForm({
              ...initialForm,
              fullName: userFullName,
              email: userEmail,
              studentId,
            }),
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
            onPress: () => Alert.alert("Notifications", "No new card application updates right now."),
            accessibilityLabel: "Notifications",
            badge: true,
          },
        ]}
      >
        <Text style={[styles.topTitle, { color: theme.topBarText }]}>Alumni Card Application</Text>
      </PortalHeader>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.sectionBackground }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {searchOpen ? (
          <View style={[styles.helperCard, { backgroundColor: theme.sectionCardBackground }]}>
            <Text style={[styles.helperTitle, { color: theme.textPrimary }]}>What you can do here</Text>
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Submit a new alumni card request, request a replacement card, and confirm your contact details for delivery
              or pick-up.
            </Text>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Processing Info</Text>
          <Text style={styles.infoText}>• {processingMessage}</Text>
          <Text style={styles.infoText}>• Bring a valid ID when claiming your alumni card.</Text>
          <Text style={styles.infoText}>• You will receive a confirmation notice after approval.</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Application Details</Text>

          <Field label="Card Type" theme={theme}>
            <View style={styles.optionRow}>
              <SelectCard
                title="New Application"
                subtitle="First alumni card request"
                selected={form.cardType === "new"}
                theme={theme}
                onPress={() => setField("cardType", "new")}
              />
              <SelectCard
                title="Replacement"
                subtitle="Lost or damaged card"
                selected={form.cardType === "replacement"}
                theme={theme}
                onPress={() => setField("cardType", "replacement")}
              />
            </View>
          </Field>

          <Field label="Full Name" required theme={theme}>
            <Input value={form.fullName} onChangeText={(value) => setField("fullName", value)} theme={theme} />
          </Field>

          <Field label="Email Address" required theme={theme}>
            <Input
              value={form.email}
              onChangeText={(value) => setField("email", value)}
              theme={theme}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Field>

          <Field label="Student ID Number" required theme={theme}>
            <Input
              value={form.studentId}
              onChangeText={(value) => setField("studentId", value.replace(/[^0-9-]/g, ""))}
              theme={theme}
              keyboardType="number-pad"
            />
          </Field>

          <Field label="Year of Graduation" required theme={theme}>
            <Input
              value={form.graduationYear}
              onChangeText={(value) => setField("graduationYear", value.replace(/[^0-9]/g, ""))}
              theme={theme}
              keyboardType="number-pad"
            />
          </Field>

          <Field label="Mobile Number" required theme={theme}>
            <Input
              value={form.phone}
              onChangeText={(value) => setField("phone", value)}
              theme={theme}
              keyboardType="phone-pad"
              placeholder="+63 XXX XXX XXXX"
            />
          </Field>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Card Delivery Method</Text>

          <Field label="Receive Card Via" required theme={theme}>
            <View style={styles.optionRow}>
              <SelectCard
                title="Pick-up at Office"
                subtitle="Free claiming at Campus One"
                selected={form.deliveryMethod === "pickup"}
                theme={theme}
                onPress={() => setField("deliveryMethod", "pickup")}
              />
              <SelectCard
                title="Delivery"
                subtitle="Send card to your address"
                selected={form.deliveryMethod === "delivery"}
                theme={theme}
                onPress={() => setField("deliveryMethod", "delivery")}
              />
            </View>
          </Field>

          {form.deliveryMethod === "delivery" ? (
            <Field label="Delivery Address" required theme={theme}>
              <Input
                value={form.address}
                onChangeText={(value) => setField("address", value)}
                theme={theme}
                placeholder="House number, street, city"
                multiline
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
              I authorize Campus One to collect and process my information for alumni card application purposes.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={submitApplication}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </Pressable>
      </ScrollView>
    </>
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

function Input({
  value,
  onChangeText,
  theme,
  placeholder = "",
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
}: {
  value: string;
  onChangeText: (value: string) => void;
  theme: AppTheme;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
}): React.JSX.Element {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textMuted}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      style={[
        styles.input,
        multiline ? styles.textArea : null,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.textPrimary,
        },
      ]}
    />
  );
}

function SelectCard({
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
        styles.selectCard,
        {
          backgroundColor: selected ? "#FFF8E1" : theme.inputBackground,
          borderColor: selected ? theme.topBarAccent : theme.inputBorder,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.selectCardTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.selectCardSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  topTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 29,
    marginLeft: 16,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 2,
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
  helperText: {
    fontSize: 13,
    lineHeight: 20,
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
  optionRow: {
    gap: 12,
  },
  selectCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  selectCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },
  selectCardSubtitle: {
    fontSize: 13,
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
});
