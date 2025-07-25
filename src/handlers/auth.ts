import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import type { User, Address } from "../types/user";
import { uploadImage } from "@/lib/cloudinary";

export interface RegisterData {
  username: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  phone: string;
  email: string;
  password: string;
  role: "seller" | "buyer";
  profileImage?: File | null;
  address?: Address;
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      return {
        user,
        isNewUser: true,
        userData: {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
        },
      };
    }

    return { user, isNewUser: false, userData: userDoc.data() };
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    return { user: result.user, userData: userDoc.data() };
  } catch (error) {
    console.error("Email sign in error:", error);
    throw error;
  }
};

export const registerUser = async (data: RegisterData) => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = result.user;

    let profileImageUrl = "";

    console.log("Registering user:", data);
    if (data.profileImage) {
      profileImageUrl = await uploadImage(data.profileImage);
    }

    const userData: User = {
      uid: user.uid,
      username: data.username,
      email: data.email,
      phone: data.phone,
      addresses: data.address ? [data.address] : [],
      role: data.role,
      created_at: Timestamp.now(),
      profile_image: profileImageUrl || "",
      first_name: data.firstName,
      last_name: data.lastName,
      birthdate: Timestamp.fromDate(new Date(data.birthdate)),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return { user, userData };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const completeGoogleUserProfile = async (
  user: FirebaseUser,
  additionalData: {
    username: string;
    role: "seller" | "buyer";
    profileImage?: File | null;
    address?: Address;
    phone?: string;
  }
) => {
  try {
    let profileImageUrl = "";

    if (additionalData.profileImage) {
      profileImageUrl = await uploadImage(additionalData.profileImage);
    }

    const userData: User = {
      uid: user.uid,
      username: additionalData.username,
      email: user.email || "",
      phone: user.phoneNumber || additionalData.phone || "",
      addresses: additionalData.address ? [additionalData.address] : [],
      role: additionalData.role,
      created_at: Timestamp.now(),
      profile_image: profileImageUrl || user.photoURL || "",
      first_name: user.displayName?.split(" ")[0] || "",
      last_name: user.displayName?.split(" ").slice(1).join(" ") || "",
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return userData;
  } catch (error) {
    console.error("Complete profile error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Firebase Sign out error:", error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data() as User | null;
  } catch (error) {
    console.error("Get user data error:", error);
    throw error;
  }
};

export const handleSignOut = () => {
  try {
    signOut();
    window.location.href = "/login"; // Redirect to login page after sign out
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
