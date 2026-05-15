import { supabase } from '../lib/supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabase.auth.signUp({
    email, password, options: { data: metadata ?? {} },
  });
  return { data, error };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}
