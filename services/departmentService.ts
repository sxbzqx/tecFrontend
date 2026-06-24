import { $api } from "@/app/api/api";
import { Department } from "@/types/department";

export const departmentService = {
  async getAll() {
    const { data } = await $api.get<Department[]>("/otdels");
    return data;
  }
};