// Feature: mobile-enrollment, Property 9: successful enrollment returns id and status

import * as fc from 'fast-check';
import { submitEnrollment, isEnrollmentError, EnrollmentResult } from './enrollment';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Minimal UUID v4 regex */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── Mock supabase ────────────────────────────────────────────────────────────

// We mock the supabase module so the RPC call returns a controlled success response.
jest.mock('../lib/supabase', () => {
  const rpcMock = jest.fn();
  return {
    supabase: {
      from: jest.fn(),
      rpc: rpcMock,
    },
  };
});

import { supabase } from '../lib/supabase';
const rpcMock = supabase.rpc as jest.Mock;

// ─── Property 9: Successful enrollment returns id and status ─────────────────

describe('Property 9: successful enrollment returns id and status', () => {
  /**
   * Validates: Requirements 4.3, 5.3, 10.5
   *
   * For any successful submitEnrollment call, the returned value should contain
   * a non-null enrollmentId (a valid UUID) and status = 'submitted'.
   */
  it('returns a valid UUID enrollmentId and status=submitted on RPC success', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),           // enrollmentId returned by RPC
        fc.uuid(),           // studentId
        fc.string({ minLength: 1 }),  // schoolYear
        fc.string({ minLength: 1 }),  // term
        fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }), // offeringIds
        async (enrollmentId, studentId, schoolYear, term, offeringIds) => {
          // Mock RPC to return a successful row
          rpcMock.mockResolvedValueOnce({
            data: [{ enrollment_id: enrollmentId, status: 'submitted', error_code: null, error_message: null }],
            error: null,
          });

          const result = await submitEnrollment(studentId, schoolYear, term, offeringIds);

          // Must not be an error
          expect(isEnrollmentError(result)).toBe(false);
          const { enrollmentId: retId, status } = result as EnrollmentResult;

          // enrollmentId must be a non-null UUID
          expect(retId).toBeTruthy();
          expect(retId).toMatch(UUID_RE);

          // status must be 'submitted'
          expect(status).toBe('submitted');
        },
      ),
      { numRuns: 100 },
    );
  });
});
