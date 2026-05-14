# Campus Portal — Mobile

React Native (Expo) mobile app for students, professors, alumni, and admissions.

---

## Prerequisites

- Node.js 18+
- npm 9+
- Expo Go app on your phone (for testing) — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## Setup

```bash
npm install
```

Create a `.env` file in this folder:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Run

```bash
npx expo start
```

Then choose how to open the app:

| Key | Action |
|-----|--------|
| `w` | Open in web browser (http://localhost:8081) |
| `a` | Open in Android emulator |
| `i` | Open in iOS simulator (Mac only) |
| Scan QR | Open in Expo Go on your phone |

---

## Roles & Navigation

| Role | Entry Point |
|------|-------------|
| Student | Login → Student Drawer (Dashboard, Enrollment, Grades, etc.) |
| Professor | Login → Professor Dashboard (Classes, Grades) |
| Alumni | Login → Alumni Dashboard |
| Admin | Login → Admin Dashboard (web only) |
| Applicant | Welcome → Admissions Flow |

---

## Screens

**Auth:**
- `WelcomeScreen` — Entry point with New Applicant, Alumni Sign Up, Sign In
- `LoginScreen` — Email/password login

**Student:**
- `DashboardScreen` — Overview and quick actions
- `OnlineEnrollmentScreen` — Enrollment flow
- `ViewSemestralGradesScreen` — Grades and GWA
- `BrowseSubjectsScreen` — Subject search and cart
- `AdvisedCoursesScreen`, `AddDropCoursesScreen`, `DeficienciesScreen`
- `GraduationScreen`, `BalancePaymentScreen`

**Professor:**
- `ProfessorDashboard` — Class list
- `ProfessorClassDetail` — Class roster and grade encoding

**Alumni:**
- `AlumniDashboard` — Alumni portal
- `AlumniRegisterScreen` — Alumni registration

**Admissions:**
- Full multi-step application flow (School Level → Applicant Type → Personal Profile → Parent Info → Academic Background → Program Selection → Documents → Confirmation)

---

## Tech Stack

- **Framework:** React Native + Expo
- **Navigation:** React Navigation (Drawer + Stack)
- **Language:** TypeScript
- **Auth & Database:** Supabase
- **Styling:** StyleSheet + Custom Theme

---

## Build for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for both platforms
eas build --platform all

# Android only
eas build --platform android

# iOS only (requires Mac + Apple Developer account)
eas build --platform ios
```
