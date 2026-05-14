export type RootStackParamList = {
  Auth: undefined;
  Student: undefined;
  Professor: undefined;
  ProfessorClassList: undefined;
  ProfessorClassDetail: { classId: string };
  Admin: undefined;
  Alumni: undefined;
};

export type ApplicantStackParamList = {
  SelectApplicationType: undefined;
  CreateApplicationAccount: undefined;
  ApplicantProfile: undefined;
  ApplicantAcademicBackground: undefined;
  DocumentCenter: undefined;
  AdmissionResult: undefined;
};

export type StudentDrawerParamList = {
  Dashboard: undefined;

  "Browse Subjects": undefined;
  "Enrollment Search": undefined;
  "Enrollment Cart": undefined;
  "My Courses": undefined;
  Notifications: undefined;

  Profile: undefined;
  "Course Details": undefined;
  Evaluation: undefined;

  "Online Enrollment": undefined;
  "Regular Path Enrollment": { schoolYear: string; term: string };
  "Irregular Path Enrollment": { schoolYear: string; term: string };
  "Balance Payment": undefined;
  "Advised Courses": undefined;
  "Add/Drop Courses": undefined;
  Deficiencies: undefined;

  "View Semestral Grades": undefined;
  Graduation: undefined;

  Help: undefined;
  Settings: undefined;
  Logout: undefined;
};
