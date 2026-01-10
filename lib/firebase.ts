import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  Auth,
  User as FirebaseUser
} from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== "undefined") {
  // Validate required fields before initializing
  const missing = [
    ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
    ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
  ].filter(([, v]) => !v);

  if (missing.length > 0) {
    const names = missing.map(([k]) => k).join(", ");
    throw new Error(
      `Firebase config missing: ${names}. Update client/.env.local and restart dev server.`
    );
  }

  // Basic API key sanity check (Firebase Web API keys typically start with AIza)
  if (firebaseConfig.apiKey && !/^AIza[\w-]{10,}$/.test(String(firebaseConfig.apiKey))) {
    throw new Error(
      "Firebase: Invalid NEXT_PUBLIC_FIREBASE_API_KEY. Copy the exact Web API key from Firebase Console → Project settings → Your apps (Web)."
    );
  }

  // Only initialize on client side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig as any);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
}

// Export auth methods
export { auth };

/**
 * Sign in with Google popup
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();
    
    return {
      user: userCredential.user,
      idToken,
    };
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("Sign-in cancelled");
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error("Popup blocked by browser. Please allow popups for this site.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error("Another sign-in popup is already open");
    }
    
    throw new Error(error.message || "Google sign-in failed");
  }
}

/**
 * Sign out
 */
export async function logoutFirebase() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Firebase logout error:", error);
    throw new Error(error.message || "Logout failed");
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  if (typeof window !== "undefined" && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
}

/**
 * Get current user ID token
 */
export async function getCurrentUserToken(): Promise<string | null> {
  if (typeof window !== "undefined" && auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }
  return null;
}
