import type { SchoolLevel, ApplicantType, RequirementItem } from '../types/admissions.types';

type RequirementsMap = Partial<
  Record<SchoolLevel, Partial<Record<ApplicantType, RequirementItem[]>>>
>;

export const REQUIREMENTS_CONFIG: RequirementsMap = {
  Kinder: {
    Freshman: [
      {
        id: 'kinder-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'kinder-parent-id',
        name: 'Parent/Guardian Valid ID',
        description: 'Government-issued ID of parent or guardian',
        required: true,
      },
      {
        id: 'kinder-readiness-form',
        name: 'Kindergarten Readiness Form',
        description: 'Completed kindergarten readiness assessment form',
        required: true,
      },
      {
        id: 'kinder-2x2-photo',
        name: '2x2 Photo (2 copies)',
        description: 'Recent photo with white background',
        required: true,
      },
    ],
  },
  Elementary: {
    Freshman: [
      {
        id: 'elem-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'elem-report-card',
        name: 'Kindergarten Report Card',
        description: 'Report card from previous school',
        required: true,
      },
      {
        id: 'elem-good-moral',
        name: 'Good Moral Certificate',
        description: 'From previous school attended',
        required: true,
      },
      {
        id: 'elem-parent-id',
        name: 'Parent/Guardian Valid ID',
        description: 'Government-issued ID of parent or guardian',
        required: true,
      },
    ],
    Transferee: [
      {
        id: 'elem-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'elem-transfer-report-card',
        name: 'Latest Report Card',
        description: 'Report card from previous school',
        required: true,
      },
      {
        id: 'elem-good-moral',
        name: 'Good Moral Certificate',
        description: 'From previous school attended',
        required: true,
      },
      {
        id: 'elem-form-137',
        name: 'Form 137 (School Records)',
        description: 'Official school records with grades',
        required: true,
      },
    ],
  },
  'Junior High School': {
    Freshman: [
      {
        id: 'jhs-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'jhs-form-138',
        name: 'Form 138 (Report Card)',
        description: 'Elementary completion report card',
        required: true,
      },
      {
        id: 'jhs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From elementary school completed',
        required: true,
      },
      {
        id: 'jhs-diploma',
        name: 'Elementary Diploma',
        description: 'Original copy of elementary diploma',
        required: true,
      },
    ],
    Transferee: [
      {
        id: 'jhs-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'jhs-form-137',
        name: 'Form 137',
        description: 'Official school records from previous JHS',
        required: true,
      },
      {
        id: 'jhs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From previous school attended',
        required: true,
      },
    ],
    Returnee: [
      {
        id: 'jhs-birth-cert',
        name: 'Birth Certificate (PSA)',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'jhs-form-137',
        name: 'Form 137',
        description: 'Official school records from last JHS attended',
        required: true,
      },
      {
        id: 'jhs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From last school attended',
        required: true,
      },
      {
        id: 'jhs-affidavit',
        name: 'Affidavit of Return',
        description: 'Notarized affidavit explaining reason for return',
        required: false,
      },
    ],
  },
  'Senior High School': {
    Freshman: [
      {
        id: 'shs-form-137',
        name: 'Form 137',
        description: 'JHS official school records with grades',
        required: true,
      },
      {
        id: 'shs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From JHS school attended',
        required: true,
      },
      {
        id: 'shs-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'shs-jhs-diploma',
        name: 'JHS Diploma',
        description: 'Original copy of Junior High School diploma',
        required: true,
      },
    ],
    Transferee: [
      {
        id: 'shs-form-137',
        name: 'Form 137',
        description: 'Official school records from previous SHS',
        required: true,
      },
      {
        id: 'shs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From previous SHS attended',
        required: true,
      },
      {
        id: 'shs-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
    ],
    Returnee: [
      {
        id: 'shs-form-137',
        name: 'Form 137',
        description: 'Official school records from last SHS attended',
        required: true,
      },
      {
        id: 'shs-good-moral',
        name: 'Good Moral Certificate',
        description: 'From last school attended',
        required: true,
      },
      {
        id: 'shs-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'shs-affidavit',
        name: 'Affidavit of Return',
        description: 'Notarized affidavit explaining reason for return',
        required: false,
      },
    ],
  },
  College: {
    Freshman: [
      {
        id: 'col-form-138',
        name: 'Form 138 (Report Card)',
        description: 'SHS completion report card with grades',
        required: true,
      },
      {
        id: 'col-entrance-exam',
        name: 'Entrance Exam Result',
        description: 'Result of college entrance examination',
        required: true,
      },
      {
        id: 'col-good-moral',
        name: 'Good Moral Certificate',
        description: 'From SHS attended',
        required: true,
      },
      {
        id: 'col-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'col-shs-diploma',
        name: 'SHS Diploma',
        description: 'Original Senior High School diploma',
        required: true,
      },
    ],
    Transferee: [
      {
        id: 'col-tor',
        name: 'Transcript of Records',
        description: 'Official TOR from previous college/university',
        required: true,
      },
      {
        id: 'col-honorable-dismissal',
        name: 'Honorable Dismissal',
        description: 'Certificate of honorable dismissal from previous school',
        required: true,
      },
      {
        id: 'col-transfer-credentials',
        name: 'Transfer Credentials',
        description: 'All transfer documents from previous institution',
        required: true,
      },
      {
        id: 'col-good-moral',
        name: 'Good Moral Certificate',
        description: 'From previous institution attended',
        required: true,
      },
      {
        id: 'col-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
    ],
    Shiftee: [
      {
        id: 'col-tor',
        name: 'Transcript of Records',
        description: 'Certified TOR from current program',
        required: true,
      },
      {
        id: 'col-shiftee-form',
        name: 'Shiftee Application Form',
        description: 'Completed shiftee application form',
        required: true,
      },
      {
        id: 'col-study-plan',
        name: 'Study Plan',
        description: 'Approved study plan for new program',
        required: true,
      },
      {
        id: 'col-good-moral',
        name: 'Good Moral Certificate',
        description: 'Certified by the Registrar\'s Office',
        required: true,
      },
    ],
    Returnee: [
      {
        id: 'col-tor',
        name: 'Transcript of Records',
        description: 'Official TOR from last enrollment',
        required: true,
      },
      {
        id: 'col-birth-cert',
        name: 'PSA Birth Certificate',
        description: 'Original PSA-authenticated birth certificate',
        required: true,
      },
      {
        id: 'col-good-moral',
        name: 'Good Moral Certificate',
        description: 'From last institution attended',
        required: true,
      },
      {
        id: 'col-affidavit',
        name: 'Affidavit of Return',
        description: 'Notarized affidavit explaining reason for return',
        required: false,
      },
    ],
  },
};

export function getRequirements(
  schoolLevel: SchoolLevel,
  applicantType: ApplicantType
): RequirementItem[] {
  return REQUIREMENTS_CONFIG[schoolLevel]?.[applicantType] ?? [];
}
