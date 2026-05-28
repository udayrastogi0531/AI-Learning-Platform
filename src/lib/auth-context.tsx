"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'learner' | 'instructor' | 'org_admin' | 'super_admin';
  orgId?: string;
  createdAt: any;
  lastLoginAt: any;
  emailVerified: boolean;
  phone?: string;
  bio?: string;
  interests?: string;
  learningGoal?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    notifications: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile in Firestore
  const createUserProfile = async (user: User, additionalData?: any) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL, emailVerified } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || "",
          email,
          photoURL: photoURL || "",
          role: 'learner', // Default role
          emailVerified,
          createdAt,
          lastLoginAt: createdAt,
          preferences: {
            theme: "system",
            language: "en",
            notifications: true,
          },
          ...additionalData,
        });
      } catch (error) {
        console.error("❌ Error creating user profile:", error);
        console.log("💡 Tip: Check Firestore security rules in Firebase Console");
        console.log("📖 See FIRESTORE_RULES_SETUP.md for instructions");
      }
    } else {
      // Update last login time
      try {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          emailVerified: user.emailVerified,
        });
      } catch (error) {
        console.error("⚠️ Error updating user profile:", error);
        console.log("💡 This is non-critical - continuing with cached profile");
      }
    }

    // Fetch and set user profile
    try {
      const updatedUserSnap = await getDoc(userRef);
      if (updatedUserSnap.exists()) {
        setUserProfile(updatedUserSnap.data() as UserProfile);
      } else {
        // Profile doesn't exist in Firestore yet, create a minimal local one
        console.warn("⚠️ User profile not found in Firestore, using minimal profile");
        setUserProfile({
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          role: 'learner',
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: "system",
            language: "en",
            notifications: true,
          },
        });
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      console.log("💡 Check Firestore rules - see FIRESTORE_RULES_SETUP.md");
      // Create minimal profile from auth data
      setUserProfile({
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        role: 'learner',
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: "system",
          language: "en",
          notifications: true,
        },
      });
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(result.user, { displayName });

      // Create user profile (skip email verification for now to avoid issues)
      await createUserProfile(result.user, { displayName });

      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Better error messages for users
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use the "Sign In Instead" button below to log into your existing account.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Better error messages for users
      if (error.code === 'auth/invalid-credential') {
        throw new Error('❌ Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('❌ No account found with this email. Please register first or check your email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('❌ Incorrect password. Please try again or use "Forgot Password" to reset.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('❌ Invalid email format. Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");

    try {
      // Use popup for better UX in development
      const result = await signInWithPopup(auth, provider);
      console.log(`result `, result);
      await createUserProfile(result.user);
      return result;
    } catch (error: any) {
      // If popup is blocked, fall back to redirect
      if (error.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, provider);
        throw new Error("Redirecting for authentication...");
      }
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);

    // Update local state
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  // Resend email verification
  const resendVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await createUserProfile(result.user);
        }
      } catch (error) {
        console.error("Redirect result error:", error);
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Set auth cookie for middleware
        try {
          const token = await user.getIdToken();
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=lax`;
        } catch (error) {
          console.log('Could not set auth token cookie:', error);
        }
        await createUserProfile(user);
      } else {
        setUserProfile(null);
        // Clear auth cookies
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
