// Feature: mobile-enrollment, Property 13: term detection covers all months
// Feature: mobile-enrollment, Property 14: trimester config produces correct term labels

import * as fc from 'fast-check';
import { resolveTerm, TermResult, TermResolverError, TrimesterConfig } from './termResolver';

function isError(r: TermResult | TermResolverError): r is TermResolverError {
  return 'code' in r;
}

/**
 * Build a Date that, when interpreted in Asia/Manila (UTC+8), lands on the
 * given month and year at day 15.  We construct it as a UTC timestamp so the
 * device's local timezone never interferes.
 */
function manilaDate(year: number, month: number, day = 15): Date {
  // Manila is UTC+8, so midnight Manila = UTC-8h.
  // We just need any time that falls within the target Manila calendar day.
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // UTC noon keeps us safely in the right Manila day
}

// ─── Unit tests ──────────────────────────────────────────────────────────────

describe('resolveTerm – semester logic (unit)', () => {
  const cases: Array<[number, string, string]> = [
    [6,  '1st Semester', '2025-2026'],
    [7,  '1st Semester', '2025-2026'],
    [10, '1st Semester', '2025-2026'],
    [11, '2nd Semester', '2025-2026'],
    [12, '2nd Semester', '2025-2026'],
    [1,  '2nd Semester', '2024-2025'],
    [3,  '2nd Semester', '2024-2025'],
    [4,  'Summer',       '2024-2025'],
    [5,  'Summer',       '2024-2025'],
  ];

  test.each(cases)('month %i → term "%s", schoolYear "%s"', (month, expectedTerm, expectedSY) => {
    const year = month >= 6 ? 2025 : 2025;
    const result = resolveTerm(manilaDate(year, month));
    expect(isError(result)).toBe(false);
    const { term, schoolYear } = result as TermResult;
    expect(term).toBe(expectedTerm);
    expect(schoolYear).toBe(expectedSY);
  });

  it('school year boundary: Dec 2025 → 2025-2026', () => {
    const result = resolveTerm(manilaDate(2025, 12)) as TermResult;
    expect(result.schoolYear).toBe('2025-2026');
  });

  it('school year boundary: Jan 2026 → 2025-2026', () => {
    const result = resolveTerm(manilaDate(2026, 1)) as TermResult;
    expect(result.schoolYear).toBe('2025-2026');
  });
});

describe('resolveTerm – trimester logic (unit)', () => {
  const config: TrimesterConfig = {
    boundaries: [
      { label: '1st Trimester', startMonth: 8, endMonth: 11 },
      { label: '2nd Trimester', startMonth: 12, endMonth: 3 },
      { label: '3rd Trimester', startMonth: 4, endMonth: 7 },
    ],
  };

  it('returns matching trimester label', () => {
    const result = resolveTerm(manilaDate(2025, 9), config as any) as TermResult;
    expect(result.term).toBe('1st Trimester');
  });

  it('returns TRIMESTER_CONFIG_ERROR when no boundary matches', () => {
    // Config with a gap: month 6 is not covered
    const gapConfig: TrimesterConfig = {
      boundaries: [
        { label: 'T1', startMonth: 8, endMonth: 11 },
        { label: 'T2', startMonth: 12, endMonth: 5 },
        // month 6–7 not covered
      ],
    };
    const result = resolveTerm(manilaDate(2025, 6), gapConfig as any);
    expect(isError(result)).toBe(true);
    expect((result as TermResolverError).code).toBe('TRIMESTER_CONFIG_ERROR');
  });
});

// ─── Property 13: Term detection covers all months ───────────────────────────

describe('Property 13: term detection covers all months', () => {
  /**
   * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.6, 9.7
   */
  it('returns correct term and schoolYear format for any month/year', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 2000, max: 2099 }),
        (month, year) => {
          const date = manilaDate(year, month);
          const result = resolveTerm(date);

          // Must not be an error
          expect(isError(result)).toBe(false);
          const { term, schoolYear } = result as TermResult;

          // Term assertions
          if (month >= 6 && month <= 10) {
            expect(term).toBe('1st Semester');
          } else if (month === 11 || month === 12 || month <= 3) {
            expect(term).toBe('2nd Semester');
          } else {
            // months 4–5
            expect(term).toBe('Summer');
          }

          // School year format: 'YYYY-YYYY'
          expect(schoolYear).toMatch(/^\d{4}-\d{4}$/);
          const [syStart, syEnd] = schoolYear.split('-').map(Number);
          expect(syEnd).toBe(syStart + 1);

          // School year boundary
          if (month >= 6) {
            expect(syStart).toBe(year);
          } else {
            expect(syEnd).toBe(year);
          }
        },
      ),
      { numRuns: 200 },
    );
  });
});

// ─── Property 14: Trimester config produces correct term labels ───────────────

describe('Property 14: trimester config produces correct term labels', () => {
  /**
   * Validates: Requirements 9.5
   */
  it('returns the label of the matching boundary for any valid config and date', () => {
    // Generate a non-overlapping, full-coverage trimester config (3 equal segments)
    // and a month that falls within one of them.
    const fullCoverageConfig: TrimesterConfig = {
      boundaries: [
        { label: '1st Trimester', startMonth: 1, endMonth: 4 },
        { label: '2nd Trimester', startMonth: 5, endMonth: 8 },
        { label: '3rd Trimester', startMonth: 9, endMonth: 12 },
      ],
    };

    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 2000, max: 2099 }),
        (month, year) => {
          const date = manilaDate(year, month);
          const result = resolveTerm(date, fullCoverageConfig as any);

          // Must not be an error (all months covered)
          expect(isError(result)).toBe(false);
          const { term } = result as TermResult;

          // Find expected label
          const expected = fullCoverageConfig.boundaries.find(
            (b: { startMonth: number; endMonth: number; label: string }) => month >= b.startMonth && month <= b.endMonth,
          );
          expect(expected).toBeDefined();
          expect(term).toBe(expected!.label);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('returns TRIMESTER_CONFIG_ERROR when no boundary matches the current month', () => {
    // Config that only covers months 1–6; months 7–12 have no match
    const partialConfig: TrimesterConfig = {
      boundaries: [
        { label: 'T1', startMonth: 1, endMonth: 3 },
        { label: 'T2', startMonth: 4, endMonth: 6 },
      ],
    };

    fc.assert(
      fc.property(
        fc.integer({ min: 7, max: 12 }),
        fc.integer({ min: 2000, max: 2099 }),
        (month, year) => {
          const result = resolveTerm(manilaDate(year, month), partialConfig as any);
          expect(isError(result)).toBe(true);
          expect((result as TermResolverError).code).toBe('TRIMESTER_CONFIG_ERROR');
        },
      ),
      { numRuns: 100 },
    );
  });
});
