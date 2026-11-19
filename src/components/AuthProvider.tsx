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
  onAuthStateChanged,
  signInWithPopup,
  signOut,
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
import { auth, db, googleProvider, testConnection } from "@/lib/firebase";
import { BOOT_ADMIN_EMAIL } from "@/lib/demo-fallback";
import { OperationType, handleFirestoreError } from "@/lib/firestore-errors";
import type { PlatformRole, PublicUser } from "@/lib/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  publicUser: PublicUser | null;
  isAuthReady: boolean;
  isPlatformAdmin: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<PublicUser | null>;
  signOutUser: () => Promise<void>;
  resolveDefaultRoute: (user: PublicUser | null) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserAndRole(fbUser: FirebaseUser): Promise<PublicUser> {
  const email = (fbUser.email || "").trim().toLowerCase();
  const fullName =
    fbUser.displayName?.trim() ||
    (email ? email.split("@")[0] : "") ||
    "QLUB User";

  const userRef = doc(db, "users", fbUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists() && fbUser.emailVerified) {
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
  if (email === BOOT_ADMIN_EMAIL && fbUser.emailVerified) {
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
  } else if (fbUser.emailVerified) {
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
        setIsAuthReady(true);
        return;
      }
      setFirebaseUser(fbUser);
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

        if (code === "auth/popup-blocked") {
          setAuthError(
            "Sign-in popup was blocked by your browser. Please allow popups for this site and try again."
          );
          return null;
        }

        setAuthError(
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google."
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

  const signOutUser = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
    setFirebaseUser(null);
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
    publicUser?.platformRole === "owner" ||
      publicUser?.platformRole === "support"
  );

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        publicUser,
        isAuthReady,
        isPlatformAdmin,
        isSigningIn,
        authError,
        clearAuthError,
        signInWithGoogle,
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
