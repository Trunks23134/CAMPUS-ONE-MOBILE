import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'professor' | 'admin' | 'alumni' | 'applicant' | null;

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  contact_number: string | null;
  address: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  role: string;
  campus: string | null;
  studentAccountId: string | null;
  applicantId: string | null;
  program: string | null;
  applicantStatus: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  userRole: UserRole;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function detectRole(email: string): Promise<UserRole> {
  const { data: student } = await supabase
    .schema('student')
    .from('student_accounts')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (student) return 'student';

  const { data: professor } = await supabase
    .schema('faculty')
    .from('professor_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (professor) return 'professor';

  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (admin) return 'admin';

  const { data: alumni } = await supabase
    .schema('alumni')
    .from('alumni')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (alumni) return 'alumni';

  const { data: applicant } = await supabase
    .schema('applicant')
    .from('applicant_profiles')
    .select('id, status')
    .eq('email', email)
    .maybeSingle();
  if (applicant) return 'applicant';

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string) => {
    // Detect role
    const role = await detectRole(email);
    setUserRole(role);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: ap } = await supabase
      .from('applicant_profiles')
      .select('first_name, last_name, program, status, mobile_number, address, birthdate')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile({
        id: data.id,
        full_name: ap
          ? `${ap.first_name ?? ''} ${ap.last_name ?? ''}`.trim() || data.full_name
          : data.full_name ?? null,
        email: data.email ?? null,
        contact_number: ap?.mobile_number ?? data.contact_number ?? null,
        address: ap?.address ?? data.address ?? null,
        date_of_birth: ap?.birthdate ?? data.date_of_birth ?? null,
        avatar_url: data.avatar_url ?? null,
        role: data.role,
        campus: data.campus ?? null,
        studentAccountId: userId,
        applicantId: userId,
        program: ap?.program ?? null,
        applicantStatus: ap?.status ?? null,
      });
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session ?? null);
    } catch (error: unknown) {
      if (error instanceof Error && /refresh token/i.test(error.message)) {
        await supabase.auth.signOut().catch(() => {});
      }
      setSession(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const clearInvalidSession = async () => {
      await supabase.auth.signOut().catch(() => {});
      try {
        await AsyncStorage.removeItem('supabase.auth.token');
        await AsyncStorage.removeItem('supabase.auth.refresh.token');
      } catch {
        // ignore storage cleanup failures
      }
      if (mounted) {
        setSession(null);
        setProfile(null);
        setUserRole(null);
      }
    };

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          setSession(data.session ?? null);
          if (data.session?.user) {
            await fetchProfile(data.session.user.id, data.session.user.email ?? '');
          }
        }
      } catch (error: unknown) {
        if (mounted) {
          if (error instanceof Error && /refresh token/i.test(error.message)) {
            await clearInvalidSession();
          } else {
            setSession(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return;

        if (event === 'TOKEN_REFRESHED' && !nextSession) {
          await clearInvalidSession();
          setLoading(false);
          return;
        }

        setSession(nextSession ?? null);
        if (nextSession?.user) {
          setTimeout(() => fetchProfile(nextSession.user.id, nextSession.user.email ?? ''), 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, profile, userRole, loading, refreshSession }),
    [loading, session, profile, userRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
