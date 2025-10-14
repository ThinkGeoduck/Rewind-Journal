import { useUserStore } from '../stores/user.store';

interface UserInfo {
  name: string;
  age: number;
}

export async function signInWithEmail(email: string, password: string) {
  // For now, just return success since we're not using real auth
  return { success: true };
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  age: number
) {
  try {
    // Store user info locally
    useUserStore.getState().setUser(name, age);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    useUserStore.getState().clearUser();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

let currentUser: UserInfo | null = null;

export function setUserInfo(info: UserInfo) {
  currentUser = info;
}

export function getUserInfo() {
  return currentUser;
} 