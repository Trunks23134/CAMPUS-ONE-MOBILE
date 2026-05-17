import React, { ReactNode, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Footer from "./Footer";
import PortalHeader from "./PortalHeader";
import { AppTheme } from "./theme";

type RegisterPageProps = {
  isDarkMode: boolean;
  theme: AppTheme;
  onBack: () => void;
  onLogin: () => void;
};

type RegisterForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  lastProgram: string;
  proofReference: string;
  academicUnit: string;
  gradYear: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  studentId: "",
  lastProgram: "",
  proofReference: "",
  academicUnit: "",
  gradYear: "",
  password: "",
  confirmPassword: "",
};

const academicUnits: string[] = [
  "College of Accountancy",
  "College of Architecture",
  "Faculty of Arts and Letters",
  "Faculty of Civil Law",
  "College of Commerce and Business Administration",
  "College of Education",
  "Faculty of Engineering",
  "College of Fine Arts and Design",
  "College of Information and Computing Sciences",
  "Faculty of Medicine and Surgery",
  "Conservatory of Music",
  "College of Nursing",
  "Faculty of Pharmacy",
  "Institute of Physical Education and Athletics",
  "College of Rehabilitation Sciences",
  "College of Science",
  "College of Tourism and Hospitality Management",
  "Ecclesiastical Faculties",
  "Graduate School",
  "Education High School",
  "Junior High School",
  "Senior High School",
];

const termsSections = [
  {
    title: "Acceptance of Terms",
    body: "By creating an account, you agree to use the Campus One Alumni Portal responsibly and to provide accurate, current, and complete registration details.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that happen under your account.",
  },
  {
    title: "Use of Services",
    body: "Portal services such as alumni card applications, document requests, and profile management must only be used for lawful alumni-related purposes.",
  },
  {
    title: "Updates and Changes",
    body: "Campus One may update these terms when services, policies, or legal requirements change. Continued use of the portal means you accept the updated terms.",
  },
];

const privacySections = [
  {
    title: "Information We Collect",
    body: "Campus One collects registration, contact, academic, and request-related information needed to verify alumni identity and provide alumni services.",
  },
  {
    title: "How Information Is Used",
    body: "Your information is used to manage your account, process requests, communicate service updates, and maintain alumni records.",
  },
  {
    title: "Protection of Data",
    body: "Campus One applies reasonable administrative, technical, and organizational safeguards to protect your personal information from unauthorized access or disclosure.",
  },
];

export default function RegisterPage({ theme, onBack, onLogin }: RegisterPageProps): React.JSX.Element {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false);
  const [noStudentRecord, setNoStudentRecord] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<"terms" | "privacy" | null>(null);
  const [form, setForm] = useState<RegisterForm>(initialForm);

  const setField = (key: keyof RegisterForm, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateAccount = (): void => {
    const requiredFields = [
      form.firstName,
      form.lastName,
      form.email,
      form.phone,
      form.academicUnit,
      form.gradYear,
      form.password,
      form.confirmPassword,
    ];

    if (!requiredFields.every((value) => value.trim().length > 0)) {
      Alert.alert("Missing details", "Please complete all required fields before creating your account.");
      return;
    }

    if (!noStudentRecord && !form.studentId.trim()) {
      Alert.alert("Student ID required", "Enter your student ID or enable the no-record verification option.");
      return;
    }

    if (noStudentRecord && (!form.lastProgram.trim() || !form.proofReference.trim())) {
      Alert.alert("Verification required", "Please provide your last program and proof reference for manual verification.");
      return;
    }

    if (form.password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Password mismatch", "Password and confirm password must match.");
      return;
    }

    if (!agreed) {
      Alert.alert("Consent required", "Please agree to the Terms and Privacy Policy to continue.");
      return;
    }

    const verificationType = noStudentRecord ? "manual alumni verification" : "student record verification";
    Alert.alert(
      "Registration submitted",
      `Your account request has been received under ${verificationType}. You can now proceed to login.`,
      [{ text: "Go to Login", onPress: onLogin }],
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.pageBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.phoneFrame, { backgroundColor: theme.phoneFrameBackground }]}>
          <PortalHeader theme={theme} leftAction={{ icon: "arrow-left", onPress: onBack, accessibilityLabel: "Go back" }}>
            <Text style={[styles.topTitle, { color: theme.topBarText }]}>Register</Text>
          </PortalHeader>

          <View style={[styles.bannerWrap, { backgroundColor: theme.topBarBackground }]}>
            <View style={[styles.bannerCard, { backgroundColor: theme.sectionCardSecondary }]}>
              <Text style={[styles.bannerTitle, { color: theme.topBarAccent }]}>Join Our Alumni Network</Text>
              <Text style={[styles.bannerSubtitle, { color: theme.textMuted }]}>
                Create an account to access alumni services and stay connected with Campus One
              </Text>
            </View>
          </View>

          <View style={[styles.formArea, { backgroundColor: theme.sectionBackground }]}>
            <Section title="Personal Info" theme={theme}>
              <Field label="First Name" required theme={theme}>
                <Input value={form.firstName} onChangeText={(value) => setField("firstName", value)} theme={theme} />
              </Field>
              <Field label="Middle Name" theme={theme}>
                <Input value={form.middleName} onChangeText={(value) => setField("middleName", value)} theme={theme} />
              </Field>
              <Field label="Last Name" required theme={theme}>
                <Input value={form.lastName} onChangeText={(value) => setField("lastName", value)} theme={theme} />
              </Field>
              <Field label="Email Address" required theme={theme}>
                <Input
                  value={form.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(value) => setField("email", value)}
                  theme={theme}
                />
              </Field>
              <Field label="Phone Number" required theme={theme}>
                <Input
                  value={form.phone}
                  placeholder="+63 XXX XXX XXXX"
                  keyboardType="phone-pad"
                  onChangeText={(value) => setField("phone", value)}
                  theme={theme}
                />
              </Field>
            </Section>

            <Section title="Academic Info" theme={theme}>
              <Pressable style={styles.recordToggleRow} onPress={() => setNoStudentRecord((prev) => !prev)}>
                <View style={[styles.recordCheckWrap, noStudentRecord ? styles.recordCheckWrapActive : null]}>
                  {noStudentRecord ? <MaterialCommunityIcons name="check" size={14} color="#111111" /> : null}
                </View>
                <View style={styles.recordToggleTextWrap}>
                  <Text style={[styles.recordToggleTitle, { color: theme.textPrimary }]}>I do not have a pre-existing student record</Text>
                  <Text style={[styles.recordToggleSub, { color: theme.textMuted }]}>Use manual alumni verification instead of student ID lookup.</Text>
                </View>
              </Pressable>

              <Field label="Student ID Number" required={!noStudentRecord} theme={theme}>
                <Input
                  value={form.studentId}
                  placeholder="e.g., 202012345"
                  keyboardType="number-pad"
                  onChangeText={(value) => setField("studentId", value.replace(/[^0-9]/g, ""))}
                  theme={theme}
                />
              </Field>
              {noStudentRecord ? (
                <>
                  <Field label="Last Program or Course" required theme={theme}>
                    <Input
                      value={form.lastProgram}
                      placeholder="e.g., BS Information Systems"
                      onChangeText={(value) => setField("lastProgram", value)}
                      theme={theme}
                    />
                  </Field>
                  <Field label="Proof Reference" required theme={theme}>
                    <Input
                      value={form.proofReference}
                      placeholder="Diploma number, TOR ref, or alumni clearance ref"
                      onChangeText={(value) => setField("proofReference", value)}
                      theme={theme}
                    />
                  </Field>
                </>
              ) : null}
              <Field label="Academic Unit Affiliation" required theme={theme}>
                <DropdownInput
                  value={form.academicUnit}
                  options={academicUnits}
                  placeholder="Select academic unit"
                  isOpen={unitDropdownOpen}
                  theme={theme}
                  onToggle={() => setUnitDropdownOpen((prev) => !prev)}
                  onSelect={(value) => {
                    setField("academicUnit", value);
                    setUnitDropdownOpen(false);
                  }}
                />
              </Field>
              <Field label="Year of Graduation" required theme={theme}>
                <Input
                  value={form.gradYear}
                  placeholder="e.g., 2024"
                  keyboardType="number-pad"
                  onChangeText={(value) => setField("gradYear", value)}
                  theme={theme}
                />
              </Field>
            </Section>

            <Section title="Account Security" theme={theme}>
              <Field label="Password" required theme={theme}>
                <PasswordInput
                  value={form.password}
                  onChangeText={(value) => setField("password", value)}
                  show={showPass}
                  theme={theme}
                  onToggle={() => setShowPass((prev) => !prev)}
                />
                <Text style={[styles.hintText, { color: theme.textMuted }]}>At least 8 characters</Text>
              </Field>
              <Field label="Confirm Password" required theme={theme}>
                <PasswordInput
                  value={form.confirmPassword}
                  onChangeText={(value) => setField("confirmPassword", value)}
                  show={showConfirm}
                  theme={theme}
                  onToggle={() => setShowConfirm((prev) => !prev)}
                />
              </Field>
            </Section>

            <View style={styles.termsRow}>
              <Switch value={agreed} onValueChange={setAgreed} />
              <View style={styles.termsTextWrap}>
                <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                  I agree to the{" "}
                  <Text style={[styles.termsLink, { color: theme.topBarAccent }]} onPress={() => setActivePolicy("terms")}>
                    Terms and Conditions
                  </Text>{" "}
                  and{" "}
                  <Text style={[styles.termsLink, { color: theme.topBarAccent }]} onPress={() => setActivePolicy("privacy")}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleCreateAccount}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: theme.textMuted }]}>Already have an account? </Text>
              <Pressable onPress={onLogin}>
                <Text style={[styles.loginLink, { color: theme.topBarAccent }]}>Log In</Text>
              </Pressable>
            </View>
          </View>

          <Footer theme={theme} />
        </View>
      </ScrollView>

      <PolicyModal
        open={activePolicy !== null}
        title={activePolicy === "privacy" ? "Privacy Policy" : "Terms and Conditions"}
        sections={activePolicy === "privacy" ? privacySections : termsSections}
        theme={theme}
        onClose={() => setActivePolicy(null)}
      />
    </SafeAreaView>
  );
}

type SectionProps = {
  title: string;
  theme: AppTheme;
  children: ReactNode;
};

function Section({ title, theme, children }: SectionProps): React.JSX.Element {
  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.sectionCardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  theme: AppTheme;
  children: ReactNode;
};

function Field({ label, required = false, theme, children }: FieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

type InputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  theme: AppTheme;
};

function Input({
  value,
  onChangeText,
  placeholder = "",
  keyboardType = "default",
  autoCapitalize = "sentences",
  theme,
}: InputProps): React.JSX.Element {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textMuted}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={[
        styles.input,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.textPrimary,
        },
      ]}
    />
  );
}

type PasswordInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  show: boolean;
  theme: AppTheme;
  onToggle: () => void;
};

type DropdownInputProps = {
  value: string;
  options: string[];
  placeholder?: string;
  isOpen: boolean;
  theme: AppTheme;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

function DropdownInput({
  value,
  options,
  placeholder = "Select",
  isOpen,
  theme,
  onToggle,
  onSelect,
}: DropdownInputProps): React.JSX.Element {
  return (
    <View>
      <Pressable
        style={[
          styles.dropdownTrigger,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
          },
        ]}
        onPress={onToggle}
      >
        <Text style={[styles.dropdownText, { color: value ? theme.textPrimary : theme.textMuted }]}>
          {value || placeholder}
        </Text>
        <Text style={[styles.dropdownChevron, { color: theme.textMuted }]}>{isOpen ? "^" : "v"}</Text>
      </Pressable>

      {isOpen ? (
        <View style={[styles.dropdownMenu, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
          <ScrollView nestedScrollEnabled style={styles.dropdownList}>
            {options.map((item) => (
              <Pressable key={item} style={[styles.dropdownItem, { borderBottomColor: theme.divider }]} onPress={() => onSelect(item)}>
                <Text style={[styles.dropdownItemText, { color: theme.textPrimary }]}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function PasswordInput({ value, onChangeText, show, theme, onToggle }: PasswordInputProps): React.JSX.Element {
  return (
    <View style={styles.passwordWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        placeholder="Enter your password"
        placeholderTextColor={theme.textMuted}
        style={[
          styles.passwordInput,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.textPrimary,
          },
        ]}
      />
      <Pressable onPress={onToggle} style={styles.eyeButton} hitSlop={8}>
        <MaterialCommunityIcons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textMuted} />
      </Pressable>
    </View>
  );
}

function PolicyModal({
  open,
  title,
  sections,
  theme,
  onClose,
}: {
  open: boolean;
  title: string;
  sections: { title: string; body: string }[];
  theme: AppTheme;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.sectionCardBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={theme.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            {sections.map((section) => (
              <View key={section.title} style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: theme.textPrimary }]}>{section.title}</Text>
                <Text style={[styles.modalSectionBody, { color: theme.textSecondary }]}>{section.body}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 375,
    maxWidth: "95%",
    borderRadius: 40,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backArrow: {
    fontSize: 22,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  bannerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bannerCard: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  formArea: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionCard: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  required: {
    color: "#E53935",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  dropdownTrigger: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
  },
  dropdownChevron: {
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownMenu: {
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 220,
    overflow: "hidden",
  },
  dropdownList: {
    width: "100%",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownItemText: {
    fontSize: 15,
  },
  passwordWrap: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 44,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  hintText: {
    fontSize: 12,
    marginTop: 5,
  },
  recordToggleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },
  recordCheckWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#C6CDD8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  recordCheckWrapActive: {
    backgroundColor: "#F5A623",
    borderColor: "#F5A623",
  },
  recordToggleTextWrap: {
    flex: 1,
  },
  recordToggleTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  recordToggleSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  termsTextWrap: {
    flex: 1,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#F5A623",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  modalCard: {
    borderRadius: 20,
    maxHeight: "82%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
    marginRight: 12,
  },
  modalScroll: {
    maxHeight: 420,
  },
  modalContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  modalSectionBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalButton: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: "#F5A623",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
});
