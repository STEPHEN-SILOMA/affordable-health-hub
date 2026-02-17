// Mock authentication service using localStorage

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  plan: string;
  memberSince: string;
}

const USERS_KEY = "afya_users";
const SESSION_KEY = "afya_session";

const defaultUser: User = {
  id: "usr_001",
  firstName: "Wanjiku",
  lastName: "Kamau",
  email: "wanjiku@email.com",
  phone: "0712 345 678",
  county: "Nairobi",
  plan: "Msingi",
  memberSince: "March 2025",
};

function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return [defaultUser];
  }
  return JSON.parse(raw);
}

export function signup(data: Omit<User, "id" | "memberSince">, password: string): User {
  const users = getUsers();
  if (users.find((u) => u.email === data.email)) {
    throw new Error("Email already registered");
  }
  const user: User = {
    ...data,
    id: `usr_${Date.now()}`,
    memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // store password hash placeholder
  const creds = JSON.parse(localStorage.getItem("afya_creds") || "{}");
  creds[data.email] = password;
  localStorage.setItem("afya_creds", JSON.stringify(creds));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function login(email: string, password: string): User {
  const users = getUsers();
  const creds = JSON.parse(localStorage.getItem("afya_creds") || "{}");
  // allow default user login with any password for demo
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("User not found");
  if (creds[email] && creds[email] !== password) throw new Error("Invalid password");
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
