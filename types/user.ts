import { Department } from "./department";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "SuperAdmin" | "Admin" | "Worker" | "Guest";
  otdelId: number;
  otdel?: Department;
}