/**
 * Term Resolver
 * Derives the current academic term and school year from Manila time (Asia/Manila, UTC+8).
 * Supports semester, trimester, and quarter systems based on campus config.
 */

export type TermResult = {
  term: string;
  schoolYear: string; // e.g. '2025-2026'
};

export type TermResolverError = {
  message: string;
  code: 'INVALID_DATE' | 'TRIMESTER_CONFIG_ERROR';
};

export type CampusTermConfig = {
  type: 'semester' | 'trimester' | 'quarter';
};

export type TrimesterConfig = {
  boundaries: Array<{ startMonth: number; endMonth: number; label: string }>;
};

/** All available terms per campus type — used to build dropdowns */
export function getTermOptions(campus: string | null, isIrregular = false): string[] {
  const type = getCampusType(campus);

  let terms: string[];
  if (type === 'trimester') {
    terms = ['First Term', 'Second Term', 'Third Term'];
  } else if (type === 'quarter') {
    terms = ['First Term', 'Second Term', 'Third Term', 'Fourth Term'];
  } else {
    // default: semester
    terms = ['First Term', 'Second Term'];
  }

  if (isIrregular) {
    terms = [...terms, 'Summer'];
  }

  return terms;
}

/** Determine campus system type from campus name */
function getCampusType(campus: string | null): 'semester' | 'trimester' | 'quarter' {
  if (!campus) return 'semester';
  const c = campus.toLowerCase();
  // Add known trimester/quarter campuses here
  if (c.includes('ateneo') || c.includes('dlsu') || c.includes('mapua')) return 'trimester';
  return 'semester';
}

/** Extract month (1–12) and year from Manila timezone */
function getManilaMonthYear(date: Date): { month: number; year: number } | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const monthPart = parts.find((p) => p.type === 'month');
    const yearPart = parts.find((p) => p.type === 'year');
    if (!monthPart || !yearPart) return null;
    const month = parseInt(monthPart.value, 10);
    const year = parseInt(yearPart.value, 10);
    if (isNaN(month) || isNaN(year)) return null;
    return { month, year };
  } catch {
    return null;
  }
}

/**
 * Resolves the current term and school year from Manila time.
 * @param now     Optional date override for testing
 * @param campus  Campus name — determines semester vs trimester system
 */
export function resolveTerm(now?: Date, campus?: string | null): TermResult | TermResolverError {
  const date = now ?? new Date();
  const manila = getManilaMonthYear(date);

  if (!manila) {
    return {
      message: 'Unable to determine current date. Please check your device clock.',
      code: 'INVALID_DATE',
    };
  }

  const { month, year } = manila;

  // School year: Jun–Dec = current-next, Jan–May = prev-current
  const schoolYear = month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  const type = getCampusType(campus ?? null);

  if (type === 'trimester') {
    // Trimester: ~4 months each
    // First Term: Jun–Sep, Second Term: Oct–Jan, Third Term: Feb–May
    let term: string;
    if (month >= 6 && month <= 9) term = 'First Term';
    else if (month >= 10 || month === 1) term = 'Second Term';
    else term = 'Third Term'; // Feb–May
    return { term, schoolYear };
  }

  if (type === 'quarter') {
    let term: string;
    if (month >= 6 && month <= 8) term = 'First Term';
    else if (month >= 9 && month <= 11) term = 'Second Term';
    else if (month === 12 || month === 1) term = 'Third Term';
    else term = 'Fourth Term'; // Feb–May
    return { term, schoolYear };
  }

  // Semester (default)
  let term: string;
  if (month >= 6 && month <= 10) term = 'First Term';
  else if (month === 11 || month === 12 || month <= 3) term = 'Second Term';
  else term = 'Summer'; // Apr–May
  return { term, schoolYear };
}
