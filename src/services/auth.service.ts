import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = "applicant" | "student" | "professor" | "alumni" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  applicantId?: string;
  studentId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Role detection based on email patterns or database lookup
async function detectUserRole(email: string): Promise<UserRole | null> {
  // Check if user is a student
  const { data: student } = await supabase
    .schema('student')
    .from("student_accounts")
    .select("id, applicant_id")
    .eq("email", email)
    .single();

  if (student) {
    return "student";
  }

  // Check admin table (public)
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("email", email)
    .single();

  if (admin) {
    return "admin";
  }

  // Check professor table
  const { data: professor } = await supabase
    .schema('faculty')
    .from("professor_users")
    .select("id")
    .eq("email", email)
    .single();

  if (professor) {
    return "professor";
  }

  // Check applicant
  const { data: applicant } = await supabase
    .schema('applicant')
    .from("applicant_profiles")
    .select("id, status")
    .eq("email", email)
    .single();

  if (applicant) {
    return "applicant";
  }

  return null;
}

// Login function with role detection
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { email, password } = credentials;

  try {
    const role = await detectUserRole(email);

    if (!role) {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }

    let authUser: AuthUser | null = null;

    if (role === "student") {
      const { data: student, error } = await supabase
        .schema('student')
        .from("student_accounts")
        .select("id, email, applicant_id, password_hash")
        .eq("email", email)
        .single();

      if (error || !student || student.password_hash !== password) {
        return { success: false, error: "Invalid credentials." };
      }

      authUser = {
        id: student.id,
        email: student.email,
        role: "student",
        studentId: student.id,
        applicantId: student.applicant_id,
      };
    } else if (role === "admin") {
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("id, email, name, password_hash, role")
        .eq("email", email)
        .single();

      if (error || !admin || admin.password_hash !== password) {
        return { success: false, error: "Invalid credentials." };
      }

      authUser = {
        id: admin.id,
        email: admin.email,
        role: "admin",
        name: admin.name,
      };
    } else if (role === "professor") {
      const { data: professor, error } = await supabase
        .schema('faculty')
        .from("professor_users")
        .select("id, email, full_name, password_hash")
        .eq("email", email)
        .single();

      if (error || !professor || professor.password_hash !== password) {
        return { success: false, error: "Invalid credentials." };
      }

      authUser = {
        id: professor.id,
        email: professor.email,
        role: "professor",
        name: professor.full_name,
      };
    }

    if (!authUser) {
      return { success: false, error: "Authentication failed." };
    }

    // Store user session
    await AsyncStorage.setItem("auth_user", JSON.stringify(authUser));

    return {
      success: true,
      user: authUser,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}

// Get current authenticated user (async)
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const userJson = await AsyncStorage.getItem("auth_user");
    if (!userJson) return null;
    return JSON.parse(userJson) as AuthUser;
  } catch {
    return null;
  }
}

// Get current authenticated user (sync - for immediate access)
export function getCurrentUserSync(): AuthUser | null {
  // This is a workaround - in React Native, we should use state
  // But for quick access in components, we'll return a cached value
  return null;
}

// Logout function
export async function logout(): Promise<void> {
  await AsyncStorage.removeItem("auth_user");
  await AsyncStorage.removeItem("applicant_id");
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// Check if user has specific role
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}
