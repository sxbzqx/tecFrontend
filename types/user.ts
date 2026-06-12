export interface User {
  id: string;
  username: string;
  email: string;
  role: "SuperAdmin" | "Admin" | "Worker" | "Guest";
}