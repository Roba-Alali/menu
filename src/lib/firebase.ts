import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  getDocFromServer,
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  type Firestore,
  type FirestoreSettings,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function initFirestore(): Firestore {
  const settings: FirestoreSettings & { useFetchStreams?: boolean } =
    typeof window !== "undefined"
      ? {
          experimentalForceLongPolling: true,
          useFetchStreams: false,
          localCache: memoryLocalCache(),
          ignoreUndefinedProperties: true,
        }
      : {
          localCache: memoryLocalCache(),
          ignoreUndefinedProperties: true,
        };

  try {
    return initializeFirestore(app, settings, firebaseConfig.firestoreDatabaseId);
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = initFirestore();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

let connectionTested = false;

export async function testConnection(): Promise<void> {
  if (typeof window === "undefined" || connectionTested) return;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export { firebaseConfig };
