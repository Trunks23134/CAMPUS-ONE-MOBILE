# Campus Portal App 🚀

Complete React Native (Expo) campus management system.

## ✨ Features

- **Student Dashboard** - Overview, notifications, my courses
- **Online Enrollment** - Regular/irregular paths, deficiencies, advised courses, add/drop
- **Grade Viewing** - Semestral grades with GWA, honors status, failed subjects
- **Subject Management** - Search, cart, block scheduling
- **Profile & Settings** - Personal info, preferences, help
- **Auth Flow** - Campus selection, applicant/student login
- **Responsive Design** - Native drawer navigation, custom theme

## 📱 Key Screens

**Auth:** Landing → Campus → Login → Dashboard  
**Enrollment:** Online Enrollment → Regular/Irregular Path → Advised Courses → Balance Payment  
**Grades:** View Semestral Grades (regular/irregular data)  
**Dashboard:** Subjects, Cart, Notifications, Profile

## 🛠 Tech Stack

| Category | Tech |
|----------|------|
| Framework | React Native + Expo |
| Navigation | @react-navigation/drawer |
| Language | TypeScript |
| Styling | StyleSheet + Custom Theme |
| State | React Hooks (useState, useMemo) |
| Data | mockStudent.ts (Juan Dela Cruz - Irregular BSIT) |

## 🚀 Quick Start & Live Server

**Development Server:**
```bash
cd campus-portal-app
npm install
npx expo start --clear
```

**Live Preview Options:**
- `e` - Expo Go app (scan QR on phone)
- `w` - Web browser (http://localhost:8081)
- `a` - Android emulator
- `i` - iOS simulator (Mac only)

**Production Build (Live App):**
```bash
# Android APK
npx expo build:android

# iOS IPA (Mac with Xcode)
npx expo build:ios

# Or use EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform all
```

**Development Build (Supabase config):**
```bash
eas build --profile development --platform all
```


**Options:**
- `e` - Expo Go (mobile)
- `w` - Web browser (localhost:8081)
- `a` - Android emulator
- `i` - iOS simulator

## 📂 Structure

```
src/
├── components/     # Card, PrimaryButton, Header
├── navigation/     # StudentDrawer, AuthStack
├── screens/
│   ├── auth/       # Landing, Login, Campus
│   ├── dashboard/  # Dashboard, SubjectCart, Search
│   ├── enrollment/ # OnlineEnrollment, Regular/Irregular Path
│   └── data/       # mockStudent.ts (student data)
├── theme/          # colors.ts, fonts.ts
└── types/          # navigation.ts
```

## 🎮 Demo Flow

1. **Start** → LandingScreen → SelectCampus → Login → **Dashboard**
2. **Enrollment** → Online Enrollment → Irregular Path → Subject Drafter
3. **Grades** → View Semestral Grades → See deficiencies (CS201 failed)
4. **Subjects** → Subject Search → Cart → Block Schedule

**Mock Student:** Juan Dela Cruz (BSIT, Irregular, AY 2026-2027)

## 🔧 Recent Updates

- ✅ Fixed mockStudent import (OnlineEnrollmentScreen)
- ✅ Added navbars to enrollment screens
- ✅ StudentDrawer TypeScript clean
- ✅ Full responsive layout + animations
- ✅ Expo server optimized

## 📄 License

Private use. Contact for production deployment.
