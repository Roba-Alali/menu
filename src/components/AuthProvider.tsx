"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  auth,
  db,
  firebaseConfig,
  googleProvider,
  testConnection,
} from "@/lib/firebase";
import { BOOT_ADMIN_EMAIL } from "@/lib/demo-fallback";
import { OperationType, handleFirestoreError } from "@/lib/firestore-errors";
import type { PlatformRole, PublicUser } from "@/lib/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  publicUser: PublicUser | null;
  isAuthReady: boolean;
  isEmailVerified: boolean;
  isPlatformAdmin: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<PublicUser | null>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<PublicUser | null>;
  registerWithEmail: (input: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<PublicUser | null>;
  resendVerificationEmail: () => Promise<boolean>;
  refreshSessionUser: () => Promise<PublicUser | null>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  resolveDefaultRoute: (user: PublicUser | null) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function formatFirebaseAuthError(error: unknown, fallback: string): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code || "")
      : "";

  switch (code) {
    case "auth/operation-not-allowed":
      return `Email/Password authentication is not enabled yet in Firebase Console. Enable Email/Password under Authentication -> Sign-in method for project "${firebaseConfig.projectId}", then retry.`;
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Double-check your credentials, or use 'Forgot / Set password' if this email previously used Google sign-in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Sign in with your password, reset it via 'Forgot password', or continue with Google.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/too-many-requests":
      return "Too many authentication attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled in Firebase Authentication.";
    case "auth/network-request-failed":
      return "Network error contacting Firebase Authentication. Check your connection and try again.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Allow popups for this site or sign in with Email & Password.";
    default:
      return error instanceof Error ? error.message : fallback;
  }
}

async function syncUserAndRole(fbUser: FirebaseUser): Promise<PublicUser> {
  const email = (fbUser.email || "").trim().toLowerCase();
  const fullName =
    fbUser.displayName?.trim() ||
    (email ? email.split("@")[0] : "") ||
    "QLUB User";

  if (!fbUser.emailVerified) {
    return {
      id: fbUser.uid,
      email,
      fullName,
      platformRole: undefined,
    };
  }

  const userRef = doc(db, "users", fbUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: fbUser.uid,
        email: email.slice(0, 200),
        fullName: fullName.slice(0, 120),
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${fbUser.uid}`);
  }

  let platformRole: PlatformRole | undefined;
  if (email === BOOT_ADMIN_EMAIL) {
    platformRole = "owner";
    const adminRef = doc(db, "platformAdmins", fbUser.uid);
    try {
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        await setDoc(adminRef, {
          uid: fbUser.uid,
          email: email.slice(0, 200),
          fullName: fullName.slice(0, 120),
          platformRole: "owner",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `platformAdmins/${fbUser.uid}`
      );
    }
  } else {
    try {
      const adminSnap = await getDoc(doc(db, "platformAdmins", fbUser.uid));
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        if (data.platformRole === "owner" || data.platformRole === "support") {
          platformRole = data.platformRole;
        }
      }
    } catch {
      // Not a platform admin; continue as standard workspace user
    }
  }

  return {
    id: fbUser.uid,
    email,
    fullName,
    platformRole,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const popupInFlightRef = useRef<Promise<PublicUser | null> | null>(null);

  useEffect(() => {
    void testConnection();
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setFirebaseUser(null);
        setPublicUser(null);
        setIsEmailVerified(false);
        setIsAuthReady(true);
        return;
      }
      setFirebaseUser(fbUser);
      setIsEmailVerified(Boolean(fbUser.emailVerified));
      try {
        const profile = await syncUserAndRole(fbUser);
        setPublicUser(profile);
      } catch (err) {
        console.error("Auth profile sync issue:", err);
        setPublicUser({
          id: fbUser.uid,
          email: (fbUser.email || "").toLowerCase(),
          fullName: fbUser.displayName || "QLUB User",
          platformRole:
            fbUser.emailVerified &&
            (fbUser.email || "").toLowerCase() === BOOT_ADMIN_EMAIL
              ? "owner"
              : undefined,
        });
      } finally {
        setIsAuthReady(true);
      }
    });
    return () => unsub();
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<PublicUser | null> => {
    if (popupInFlightRef.current) {
      return popupInFlightRef.current;
    }

    setAuthError(null);
    setIsSigningIn(true);

    const pending = (async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (!result.user) return null;
        const profile = await syncUserAndRole(result.user);
        setFirebaseUser(result.user);
        setIsEmailVerified(Boolean(result.user.emailVerified));
        setPublicUser(profile);
        return profile;
      } catch (error) {
        const code =
          typeof error === "object" && error !== null && "code" in error
            ? String((error as { code?: unknown }).code || "")
            : "";

        if (
          code === "auth/cancelled-popup-request" ||
          code === "auth/popup-closed-by-user"
        ) {
          return null;
        }

        setAuthError(
          formatFirebaseAuthError(error, "Failed to sign in with Google.")
        );
        return null;
      } finally {
        popupInFlightRef.current = null;
        setIsSigningIn(false);
      }
    })();

    popupInFlightRef.current = pending;
    return pending;
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<PublicUser | null> => {
      setAuthError(null);
      setIsSigningIn(true);
      try {
        const cleanEmail = email.trim().toLowerCase();
        const result = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );
        if (!result.user) return null;
        await result.user.getIdToken(true);
        const profile = await syncUserAndRole(result.user);
        setFirebaseUser(result.user);
        setIsEmailVerified(Boolean(result.user.emailVerified));
        setPublicUser(profile);
        return profile;
      } catch (error) {
        setAuthError(
          formatFirebaseAuthError(
            error,
            "Failed to sign in with email and password."
          )
        );
        return null;
      } finally {
        setIsSigningIn(false);
      }
    },
    []
  );

  const registerWithEmail = useCallback(
    async (input: {
      email: string;
      password: string;
      fullName?: string;
    }): Promise<PublicUser | null> => {
      setAuthError(null);
      setIsSigningIn(true);
      try {
        const cleanEmail = input.email.trim().toLowerCase();
        const result = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          input.password
        );
        if (!result.user) return null;
        const trimmedName = input.fullName?.trim();
        if (trimmedName) {
          await updateProfile(result.user, {
            displayName: trimmedName.slice(0, 120),
          });
        }
        try {
          await sendEmailVerification(result.user);
        } catch {
          // Avoid failing account creation if verification email send hits cooldown
        }
        const profile = await syncUserAndRole(result.user);
        setFirebaseUser(result.user);
        setIsEmailVerified(Boolean(result.user.emailVerified));
        setPublicUser(profile);
        return profile;
      } catch (error) {
        setAuthError(
          formatFirebaseAuthError(
            error,
            "Failed to create account with email and password."
          )
        );
        return null;
      } finally {
        setIsSigningIn(false);
      }
    },
    []
  );

  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    setAuthError(null);
    const current = auth.currentUser;
    if (!current) return false;
    try {
      await sendEmailVerification(current);
      return true;
    } catch (error) {
      setAuthError(
        formatFirebaseAuthError(error, "Unable to send verification email.")
      );
      return false;
    }
  }, []);

  const refreshSessionUser = useCallback(async (): Promise<PublicUser | null> => {
    setAuthError(null);
    const current = auth.currentUser;
    if (!current) return null;
    try {
      await reload(current);
      await current.getIdToken(true);
      const profile = await syncUserAndRole(current);
      setFirebaseUser(auth.currentUser);
      setIsEmailVerified(Boolean(current.emailVerified));
      setPublicUser(profile);
      return profile;
    } catch (error) {
      setAuthError(
        formatFirebaseAuthError(error, "Failed to refresh verification status.")
      );
      return null;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } catch (error) {
      const formatted = formatFirebaseAuthError(
        error,
        "Unable to send password reset email."
      );
      setAuthError(formatted);
      throw new Error(formatted);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
    setFirebaseUser(null);
    setIsEmailVerified(false);
    setPublicUser(null);
  }, []);

  const resolveDefaultRoute = useCallback(
    async (user: PublicUser | null): Promise<string> => {
      if (!user) return "/login";
      if (user.platformRole === "owner" || user.platformRole === "support") {
        return "/admin";
      }
      try {
        const snapByUid = await getDocs(
          query(collectionGroup(db, "members"), where("userId", "==", user.id))
        );
        if (!snapByUid.empty) {
          const slug = snapByUid.docs[0].data().restaurantId as string;
          if (slug) return `/dashboard/${slug}`;
        }
        const snapByEmail = await getDocs(
          query(
            collectionGroup(db, "members"),
            where("email", "==", user.email.toLowerCase())
          )
        );
        if (!snapByEmail.empty) {
          const slug = snapByEmail.docs[0].data().restaurantId as string;
          if (slug) return `/dashboard/${slug}`;
        }
      } catch {
        // Fallback to demo storefront if user has no restaurant membership yet
      }
      return "/r/the-house";
    },
    []
  );

  const isPlatformAdmin = Boolean(
    isEmailVerified &&
      (publicUser?.platformRole === "owner" ||
        publicUser?.platformRole === "support")
  );

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        publicUser,
        isAuthReady,
        isEmailVerified,
        isPlatformAdmin,
        isSigningIn,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        resendVerificationEmail,
        refreshSessionUser,
        requestPasswordReset,
        signOutUser,
        resolveDefaultRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
